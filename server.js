var config = require('config');
var express = require('express');
var http = require('http');
var path = require('path');
var extend = require('lodash/extend');
var app = express();
var bodyParser = require('body-parser');
var WebSocketServer = require('ws').Server;

// Development server 
// Serves HTML, bundled JS and CSS in non-production mode
var server = require('substance/util/server');

/*
  Stores
*/
var SourceStore = require('./server/SourceStore');
var DocumentStore = require('./server/DocumentStore');
var SnapshotStore = require('./server/SnapshotStore');
var ChangeStore = require('./server/ChangeStore');
var SessionStore = require('./server/SessionStore');
var UserStore = require('./server/UserStore');
var RubricStore = require('./server/RubricStore');

/*
  Engines
*/
var DocumentEngine = require('./server/MproDocumentEngine');
var AuthenticationEngine = require('./server/AuthenticationEngine');
var SnapshotEngine = require('./server/MproSnapshotEngine');
var MproEngine = require('./server/MproEngine');
var SourceEngine = require('./server/SourceEngine');

/*
  Servers
*/
var CollabServer = require('substance/collab/CollabServer');
var AuthenticationServer = require('./server/AuthenticationServer');
var DocumentServer = require('./server/MproDocumentServer');
var MproServer = require('./server/MproServer');

/*
  Models
*/
var newArticle = require('./models/article/newArticle');
var newVk = require('./models/vk/newVk');
var DocumentChange = require('substance/model/DocumentChange');

/*
  Importers
*/
var vkImporter = require('./models/vk/vkImporter');

var Database = require('./server/Database');


/*
  Stores setup
*/
var db = new Database();

var userStore = new UserStore({ db: db });
var sessionStore = new SessionStore({ db: db });

// We use the in-memory versions for now, thus we need to seed
// each time.
var changeStore = new ChangeStore({db: db});
var documentStore = new DocumentStore({db: db});
var sourceStore = new SourceStore({db: db});


var snapshotStore = new SnapshotStore({db: db});
var rubricStore = new RubricStore({db: db});

/*
  Engines setup
*/
var snapshotEngine = new SnapshotEngine({
  db: db,
  documentStore: documentStore,
  changeStore: changeStore,
  snapshotStore: snapshotStore,
  schemas: {
    'mpro-article': {
      name: 'mpro-article',
      version: '1.0.0',
      documentFactory: newArticle
    },
    'mpro-vk': {
      name: 'mpro-vk',
      version: '1.0.0',
      documentFactory: newVk
    }
  }
});

var documentEngine = new DocumentEngine({
  db: db,
  documentStore: documentStore,
  changeStore: changeStore,
  snapshotEngine: snapshotEngine,
  schemas: {
    'mpro-article': {
      name: 'mpro-article',
      version: '1.0.0',
      documentFactory: newArticle
    },
    'mpro-vk': {
      name: 'mpro-vk',
      version: '1.0.0',
      documentFactory: newVk
    }
  }
});

var authenticationEngine = new AuthenticationEngine({
  userStore: userStore,
  sessionStore: sessionStore,
  emailService: null // TODO
});

var sourceEngine = new SourceEngine({
  documentStore: documentStore,
  sourceStore: sourceStore,
  importers: {
    'vk': vkImporter
  }
});

var mproEngine = new MproEngine({
  rubricStore: rubricStore
});

/*
  Express body-parser configureation 
*/
app.use(bodyParser.json({limit: '3mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '3mb', parameterLimit: 3000 }));

/*
  Serve app
*/
var config = config.get('server');
var env = config.util.getEnv('NODE_ENV');

if(env !== 'production') {
  // Serve HTML, bundled JS and CSS in non-production mode
  server.serveHTML(app, '/', path.join(__dirname, 'index.html'), config);
  server.serveStyles(app, '/app.css', path.join(__dirname, 'app.scss'));
  server.serveJS(app, '/app.js', path.join(__dirname, 'app.js'));
  // Serve static files in non-production mode
  app.use('/assets', express.static(path.join(__dirname, 'styles/assets')));
  app.use('/fonts', express.static(path.join(__dirname, 'node_modules/font-awesome/fonts')));
} else {
  app.use('/', express.static(path.join(__dirname, '/dist')));
}

/*
  Servers setup
*/
var httpServer = http.createServer();
var wss = new WebSocketServer({ server: httpServer });

// DocumentServer
var documentServer = new DocumentServer({
  documentEngine: documentEngine,
  path: '/api/documents'
});
documentServer.bind(app);


// CollabServer
var collabServer = new CollabServer({
  documentEngine: documentEngine,

  /*
    Checks for authentication based on message.sessionToken
  */
  authenticate: function(req, cb) {
    var sessionToken = req.message.sessionToken;
    authenticationEngine.getSession(sessionToken).then(function(session) {
      cb(null, session);
    }).catch(function(err) {
      cb(err);
    });
  },

  /*
    Will store the userId along with each change. We also want to build
    a documentInfo object to update the document record with some data
  */
  enhanceRequest: function(req, cb) {
    var message = req.message;
    if (message.type === 'sync') {
      // We fetch the document record to get the old title
      documentStore.getDocument(message.documentId, function(err, docRecord) {
        var updatedAt = new Date();
        var title = docRecord.title;
        var meta = docRecord.meta;
        var rubrics = meta.rubrics;

        if (message.change) {
          // Update the title if necessary
          var change = DocumentChange.fromJSON(message.change);
          change.ops.forEach(function(op) {
            if(op.path[0] == 'meta' && op.path[1] == 'title') {
              title = op.diff.apply(title);
            }
          });

          change.ops.forEach(function(op) {
            if(op.path[0] == 'meta' && op.path[1] == 'rubrics') {
              rubrics = op.val;
            }
          });

          message.change.info = {
            userId: req.session.userId,
            updatedAt: updatedAt
          };
        }

        message.collaboratorInfo = {
          name: req.session.user.name
        };

        // update meta object with modified properties
        extend(meta, {title: title, rubrics: rubrics});

        // commit and connect method take optional documentInfo argument
        message.documentInfo = {
          updatedAt: updatedAt,
          updatedBy: req.session.userId,
          title: title,
          meta: meta
        };
        cb(null);
      });
    } else {
      // Just continue for everything that is not handled
      cb(null);
    }
  }
});

collabServer.bind(wss);

// AuthenticationServer
var authenticationServer = new AuthenticationServer({
  authenticationEngine: authenticationEngine,
  path: '/api/auth/'
});

authenticationServer.bind(app);

// MPro Server
var mproServer = new MproServer({
  mproEngine: mproEngine,
  path: '/api'
});

mproServer.bind(app);

// Error handling
// We send JSON to the client so they can display messages in the UI.

/* jshint unused: false */
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  
  if (err.inspect) {
    // This is a SubstanceError where we have detailed info
    console.error(err.inspect());
  } else {
    // For all other errors, let's just print the stack trace
    console.error(err.stack);
  }
  
  res.status(500).json({
    errorName: err.name,
    errorMessage: err.message || err.name
  });
});

// Delegate http requests to express app
httpServer.on('request', app);

// NOTE: binding to localhost means that the app is not exposed
// to the www directly.
// E.g. we'll need to establish a reverse proxy
// forwarding http+ws from domain name to localhost:5001 for instance
httpServer.listen(config.port, config.host, function() {
  console.log('Listening on ' + httpServer.address().port); 
});

// Export app for requiring in test files
module.exports = app;
let CollabServer = require('substance').CollabServer
let DocumentChange = require('substance').DocumentChange
let Err = require('substance').SubstanceError
let isUndefined = require('lodash/isUndefined')
let extend = require('lodash/extend')

/*
  DocumentServer module. Can be bound to an express instance
*/
class MproCollabServer extends CollabServer {
  constructor(config) {
    super(config)
    this.authEngine = config.authEngine
    this.documentStore = config.documentStore
  }

  /*
    Checks for authentication based on message.sessionToken
  */
  authenticate(req, res) {
    let sessionToken = req.message.sessionToken
    this.authEngine.getSession(sessionToken).then(function(session) {
      req.setAuthenticated(session)
      this.next(req, res)
    }.bind(this)).catch(function(err) {
      console.error(err)
      // Send the response with some delay
      this._error(req, res, new Err('AuthenticationError', {cause: err}))
      return
    }.bind(this))
  }

  /*
    Will store the userId along with each change. We also want to build
    a documentInfo object to update the document record with some data
  */
  enhanceRequest(req, res) {
    let message = req.message
    if (message.type === 'sync') {
      // We fetch the document record to get the old title
      this.documentStore.getDocument(message.documentId, function(err, docRecord) {
        if(err) return this.next(err)

        var updatedAt = new Date();
        var title = docRecord.title;
        var meta = docRecord.content ? find(docRecord.content.nodes, { 'id': 'meta'}) : docRecord.meta;
        var rubrics = meta.rubrics;
        var entities = meta.entities;
        var accepted;

        if (message.change) {
          // Update the title if necessary
          var change = DocumentChange.fromJSON(message.change);
          change.ops.forEach(function(op) {
            if(op.path[0] === 'meta' && op.path[1] === 'title') {
              title = op.diff.apply(title);
            }
          });

          change.ops.forEach(function(op) {
            if(op.path[0] === 'meta' && op.path[1] === 'rubrics') {
              rubrics = op.val;
            }
          });

          change.ops.forEach(function(op) {
            if(op.path[0] === 'meta' && op.path[1] === 'entities') {
              entities = op.val;
            }
          });

          change.ops.forEach(function(op) {
            if(op.path[0] === 'meta' && op.path[1] === 'accepted') {
              accepted = op.val;
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
        extend(meta, {title: title, rubrics: rubrics, entities: entities});

        if(!isUndefined(accepted)) {
          extend(meta, {accepted: accepted});
        }

        // commit and connect method take optional documentInfo argument
        message.documentInfo = {
          updatedAt: updatedAt,
          updatedBy: req.session.userId,
          title: title,
          meta: meta,
          rubrics: rubrics
        };
        this.next(req, res)
      }.bind(this));
    } else {
      // Just continue for everything that is not handled
      req.setEnhanced()
      this.next(req, res)
    }
  }

}

module.exports = MproCollabServer

let http = require('http')
let path = require('path')
let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let WebSocketServer = require('ws').Server

let httpServer = http.createServer()
let wss = new WebSocketServer({ server: httpServer })

/*
  Express body-parser configureation 
*/
app.use(bodyParser.json({limit: '3mb'}))
app.use(bodyParser.urlencoded({ extended: true, limit: '3mb', parameterLimit: 3000 }))

/*
  Config
*/
let ServerConfigurator = require('./packages/common/ServerConfigurator')
let ServerPackage = require('./packages/server/package')
let configurator = new ServerConfigurator()
configurator.setServerApp(app)
configurator.setWebSocketServer(wss)
configurator.import(ServerPackage)
let config = configurator.getAppConfig()

/*
  Serve app
*/
app.use(config.publisherEndpoint, express.static(path.join(__dirname, '/dist')))

// Error handling
// We send JSON to the client so they can display messages in the UI.

/* jshint unused: false */
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  
  if (err.inspect) {
    // This is a SubstanceError where we have detailed info
    console.error(err.inspect())
  } else {
    // For all other errors, let's just print the stack trace
    console.error(err.stack)
  }
  
  res.status(500).json({
    errorName: err.name,
    errorMessage: err.message || err.name
  })
})


// Delegate http requests to express app
httpServer.on('request', app)

// NOTE: binding to localhost means that the app is not exposed
// to the www directly.
// E.g. we'll need to establish a reverse proxy
// forwarding http+ws from domain name to localhost:5000 for instance
httpServer.listen(config.port, config.host, function() {
  console.log('Listening on ' + httpServer.address().port) // eslint-disable-line
})

// Export app for requiring in test files
module.exports = app
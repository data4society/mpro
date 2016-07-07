'use strict';

var each = require('lodash/each');
var inBrowser = require('substance/util/inBrowser');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var Component = require('substance/ui/Component');
var DocumentClient = require('./clients/MproDocumentClient');
var FileClient = require('./clients/FileClient');
var AuthenticationClient = require('./clients/AuthenticationClient');
var InboxSection = require('./mpro/InboxSection');
var ConfiguratorSection = require('./configurator/ConfiguratorSection');
var ImportSection = require('./configurator/ImportSection');
var EnterName = require('./shared/EnterName');
var Welcome = require('./shared/Welcome');
var SettingsSection = require('./shared/SettingsSection');
var MproRouter = require('./MproRouter');

var I18n = require('substance/ui/i18n');
I18n.instance.load(require('../i18n/en'));

function MproApp() {
  Component.apply(this, arguments);

  // EXPERIMENTAL: with server.serveHTML it is now possible to
  // provide dynamic configuration information via HTML meta tags
  // TODO: we want this to go into a Substance util helper
  var config = {};
  var metaTags = window.document.querySelectorAll('meta');

  each(metaTags, function(tag) {
    var name = tag.getAttribute('name');
    var content = tag.getAttribute('content');
    if (name && content) {
      config[name] = content;
    }
  });

  config.host = config.host || 'localhost';
  config.port = config.port || 5000;

  // Store config for later use (e.g. in child components)
  this.config = config;

  this.authenticationClient = new AuthenticationClient({
    httpUrl: config.authenticationServerUrl || 'http://'+config.host+':'+config.port+'/api/auth/'
  });

  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });

  this.fileClient = new FileClient({
    httpUrl: config.fileServerUrl || 'http://'+config.host+':'+config.port+'/api/files/'
  });

  this.handleActions({
    'navigate': this.navigate,
    'newDocument': this._newDocument,
    'newTrainingDocument': this._newTrainingDocument,
    'home': this._home,
    'settings': this._settings,
    'configurator': this._configurator,
    'import': this._import,
    'deleteDocument': this._deleteDocument,
    'logout': this._logout,
    'userSessionUpdated': this._userSessionUpdated
  });

  this.router = new MproRouter(this);
  this.router.on('route:changed', this._onRouteChanged, this);
}

MproApp.Prototype = function() {

  this._userSessionUpdated = function(userSession) {
    console.log('user session updated');
    this.extendState({
      userSession: userSession
    });

    if (this.state.route && this.state.route.section === 'settings') {
      this.navigate({section: 'index'});
    }
  };

  this._onRouteChanged = function(route) {
    console.log('MproApp._onRouteChanged', route);
    this.navigate(route, {replace: true});
  };


  /*
    That's the public state reflected in the route
  */
  this.getInitialState = function() {
    return {
      route: undefined,
      userSession: undefined,
      mobile: this._isMobile()
    };
  };

  this.didMount = function() {
    if (inBrowser) {
      var _window = DefaultDOMElement.getBrowserWindow();
      _window.on('resize', this._onResize, this);
    }
    var route = this.router.readRoute();
    // Replaces the current entry without creating new history entry
    // or triggering hashchange
    this.navigate(route, {replace: true});
  };

  this.dispose = function() {
    this.router.off(this);
  };

  // Life cycle
  // ------------------------------------

  this.__getLoginData = function(route) {
    var loginKey = route.loginKey;
    var storedToken = this._getSessionToken();
    var loginData;

    if (loginKey) {
      loginData = {loginKey: loginKey};
    } else if (storedToken && !this.state.userSession) {
      loginData = {sessionToken: storedToken};
    }
    return loginData;
  };

  /*
    Used to navigate the app based on given route.
  
    Example route: {section: 'note', id: 'note-25'}

    On app level, never use setState/extendState directly as this may
    lead to invalid states.
  */
  this.navigate = function(route, opts) {
    var loginData = this.__getLoginData(route);

    this._authenticate(loginData, function(err, userSession) {
      // Patch route not to include loginKey for security reasons
      delete route.loginKey;

      this.extendState({
        route: route,
        userSession: userSession
      });

      this.router.writeRoute(route, opts);
    }.bind(this));
  };

  /*  
    Authenticate based on loginData object

    Returns current userSession if no loginData is given
  */
  this._authenticate = function(loginData, cb) {
    if (!loginData) return cb(null, this.state.userSession);
    this.authenticationClient.authenticate(loginData, function(err, userSession) {
      if (err) {
        window.localStorage.removeItem('sessionToken');
        return cb(err);
      }
      this._setSessionToken(userSession.sessionToken);
      cb(null, userSession);
    }.bind(this));
  };

  /*
    Determines when a mobile view should be shown.

    TODO: Check also for user agents. Eg. on iPad we want to show the mobile
    version, even thought he screenwidth may be greater than the threshold.
  */
  this._isMobile = function() {
    return window.innerWidth < 700;
  };

  this._onResize = function() {
    if (this._isMobile()) {
      // switch to mobile
      if (!this.state.mobile) {
        this.extendState({
          mobile: true
        });
      }
    } else {
      if (this.state.mobile) {
        this.extendState({
          mobile: false
        });
      }
    }
  };

  /*
    Expose hubClient to all child components
  */
  this.getChildContext = function() {
    return {
      authenticationClient: this.authenticationClient,
      documentClient: this.documentClient,
      fileClient: this.fileClient,
      config: this.config,
      urlHelper: this.router
    };
  };


  // Rendering
  // ------------------------------------

  this.render = function($$) {
    var el = $$('div').addClass('sc-mpro-app');

    // Uninitialized
    if (this.state.route === undefined) {
      console.log('Uninitialized');
      return el;
    }

    // Login section
    if (!this.state.userSession) {
      el.append($$(Welcome).ref('welcome'));
      return el;
    }

    // Complete registration
    if (!this.state.userSession.user.name) {
      el.append($$(EnterName, this.props).ref('enterName'));
      return el;
    }

    switch (this.state.route.section) {
      case 'settings':
        el.append($$(SettingsSection, this.state).ref('settingsSection'));
        break;
      case 'inbox':
        el.append($$(InboxSection, this.state).ref('inbox'));
        break;
      case 'configurator':
        el.append($$(ConfiguratorSection, this.state).ref('configurator'));
        break;
      case 'import':
        el.append($$(ImportSection, this.state).ref('importer'));
        break;
      default: // !section || section === index
        el.append($$(InboxSection, this.state).ref('inbox'));
        break;
    }
    return el;
  };

  // Action Handlers
  // ------------------------------------

  this._home = function() {
    this.navigate({
      section: 'inbox'
    });
  };

  this._inbox = function() {
    this.navigate({
      section: 'inbox'
    });
  };

  this._settings = function() {
    this.navigate({
      section: 'settings'
    });
  };

  this._configurator = function() {
    this.navigate({
      section: 'configurator'
    });
  };

  this._import = function() {
    this.navigate({
      section: 'import'
    });
  };

  /*
    Create a new document
  */
  this._newDocument = function() {
    var userId = this.state.userSession.user.userId;
    this.documentClient.createDocument({
      schemaName: 'mpro-article',
      // TODO: Find a way not to do this statically
      // Actually we should not provide the userId
      // from the client here.
      info: {
        title: 'Untitled',
        userId: userId
      }
    }, function(err, result) {
      this.navigate({
        section: 'document',
        documentId: result.documentId
      });
    }.bind(this));
  };

  /*
    Create a new training document
  */
  this._newTrainingDocument = function() {
    var userId = this.state.userSession.user.userId;

    this.documentClient.createDocument({
      schemaName: 'mpro-trn',
      // TODO: Find a way not to do this statically
      // Actually we should not provide the userId
      // from the client here.
      info: {
        title: 'Untitled Article',
        userId: userId,
        training: true,
        rubrics: [],
        entities: [],
        accepted: false
      }
    }, function(err, result) {
      this.navigate({
        section: 'configurator',
        documentId: result.documentId
      });
    }.bind(this));
  };

  this._deleteDocument = function(documentId) {
    this.documentClient.deleteDocument(documentId, function(/*err, result*/) {
      this._home();
    }.bind(this));
  };

  /*
    Forget current user session
  */
  this._logout = function() {
    this.authenticationClient.logout(function(err) {
      if (err) return alert('Logout failed');

      var indexRoute = {};
      window.localStorage.removeItem('sessionToken');
      this.extendState({
        userSession: null,
        route: indexRoute
      });
      this.router.writeRoute(indexRoute);
    }.bind(this));
  };

  // Helpers
  // ------------------------------------

  /*
    Store session token in localStorage
  */
  this._setSessionToken = function(sessionToken) {
    console.log('storing new sessionToken', sessionToken);
    window.localStorage.setItem('sessionToken', sessionToken);
  };

  /*
    Retrieve last session token from localStorage
  */
  this._getSessionToken = function() {
    return window.localStorage.getItem('sessionToken');
  };
};

Component.extend(MproApp);

module.exports = MproApp;

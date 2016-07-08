'use strict';

var AbstractApplication = require('../common/AbstractApplication');
var MproRouter = require('./MproRouter');

/*
  Mpro Application component.
*/
function Mpro() {
  Mpro.super.apply(this, arguments);

  var configurator = this.props.configurator;
  
  this.config = configurator.getAppConfig();

  this.authenticationClient = configurator.getAuthenticationClient();
  this.documentClient = configurator.getDocumentClient();
  this.fileClient = configurator.getFileClient();
}

Mpro.Prototype = function() {

  this.getChildContext = function() {
    return {
      config: this.config,
      authenticationClient: this.authenticationClient,
      documentClient: this.documentClient,
      fileClient: this.fileClient,
      urlHelper: this.router,
      iconProvider: configurator.getIconProvider(),
      labelProvider: configurator.getLabelProvider()
    };
  };

  this.getChildConfigurator = function() {
    var scientistConfigurator = this.props.configurator;
    return scientistConfigurator.getConfigurator(this.props.mode);
  };

  this.getDefaultPage = function() {
    return 'inbox';
  };

  this.getRouter = function() {
    return new MproRouter(this);
  };

  this._onAuthentication = function(route, session) {
    if(!session) {
      route.page = 'welcome';
    } else if (!session.user.name) {
      route.page = 'entername';
    }

    return route;
  };

};

AbstractApplication.extend(Mpro);

module.exports = Mpro;
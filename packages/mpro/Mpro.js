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
  this.configurator = configurator;
  this.authenticationClient = configurator.getAuthenticationClient();
  this.documentClient = configurator.getDocumentClient();
  this.fileClient = configurator.getFileClient();
  this.componentRegistry = configurator.getComponentRegistry();
  this.iconProvider = configurator.getIconProvider();
  this.labelProvider = configurator.getLabelProvider();

  this.addPage('welcome', this.componentRegistry.get('welcome'));
  this.addPage('inbox', this.componentRegistry.get('inbox'));
  this.addPage('configurator', this.componentRegistry.get('configurator'));

  this.handleActions({
    'configurator': this._configurator,
    'inbox': this._inbox
  });
}

Mpro.Prototype = function() {

  this.getChildContext = function() {
    return {
      config: this.config,
      configurator: this.configurator,
      authenticationClient: this.authenticationClient,
      documentClient: this.documentClient,
      fileClient: this.fileClient,
      urlHelper: this.router,
      componentRegistry: this.componentRegistry,
      iconProvider: this.iconProvider,
      labelProvider: this.labelProvider
    };
  };

  this.getDefaultPage = function() {
    return 'inbox';
  };

  this.getLoginPage = function() {
    return 'welcome';
  };

  this.getRouter = function() {
    return new MproRouter(this);
  };

  this._onAuthentication = function(route, session) {
    if(!session) {
      route.page = 'welcome';
    } 
    // else if (!session.user.name) {
    //   route.page = 'entername';
    // }

    return route;
  };

  this._configurator = function() {
    this.navigate({
      page: 'configurator'
    });
  };

  this._inbox = function() {
    this.navigate({
      page: 'inbox'
    });
  };
};

AbstractApplication.extend(Mpro);

module.exports = Mpro;
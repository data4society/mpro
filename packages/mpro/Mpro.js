'use strict';

var Component = require('substance/ui/Component');

/*
  Mpro Component

  Mpro App
*/
function Mpro() {
  Component.apply(this, arguments);

  var configurator = this.props.configurator;
  
  this.config = configurator.getAppConfig();

  this.authenticationClient = configurator.getAuthenticationClient();
  this.documentClient = configurator.getDocumentClient();
  this.fileClient = configurator.getFileClient();
}

Mpro.Prototype = function() {

};

Component.extend(Mpro);

module.exports = Mpro;
'use strict';

var Configurator = require('substance/util/Configurator');
var each = require('lodash/each');

function ServerConfigurator() {
  ServerConfigurator.super.apply(this, arguments);
}

ServerConfigurator.Prototype = function() {

  /*
    Set app config
  */
  this.setAppConfig = function(config) {
    this.config.app = config;
  };

  /*
    Get app config
  */
  this.getAppConfig = function() {
    return this.config.app;
  };

  /*
    Provision of sub configurators (for different schemas)
  */
  this.addConfigurator = function(name, configurator) {
    if (!this.config.configurators) {
      this.config.configurators = {};
    }
    this.config.configurators[name] = configurator;
  };

  /*
    Get sub confgiurator
  */
  this.getConfigurator = function(name) {
    if (!this.config.configurators) {
      return undefined;
    }
    return this.config.configurators[name];
  };

  this.getSchemas = function() {
    var schemas = {};

    each(this.config.configurators, function(configurator) {
      var schema = configurator.getSchema();
      var seed = configurator.getSeed();
      schema.documentFactory = {
        createDocument: configurator.createArticle.bind(configurator, seed)
      };
      schemas[schema.name] = schema;
    });

    return schemas;
  };

}

Configurator.extend(ServerConfigurator);

module.exports = ServerConfigurator;
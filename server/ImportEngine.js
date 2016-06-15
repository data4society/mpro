"use strict";

var oo = require('substance/util/oo');
// var Err = require('substance/util/Error');
// var Promise = require("bluebird");

var OpenCorpora = require('./importers/OpenCorpora');

/*
  Implements the Import Engine API.
*/
function ImportEngine(config) {
  this.config = config;
  this.uploadPath = config.uploadPath;
  this.sourceStore = config.sourceStore;
  this.entityStore = config.entityStore;
  this.classStore = config.classStore;
  this.markupStore = config.markupStore;
  this.referenceStore = config.referenceStore;

  this.openCorpora = new OpenCorpora(config);
}

ImportEngine.Prototype = function() {

  /*
    Import data from Open Corpora
  */
  this.openCorporaImporter = function(file, classes) {
    return this.openCorpora.import(file, classes);
  };

};

oo.initClass(ImportEngine);

module.exports = ImportEngine;
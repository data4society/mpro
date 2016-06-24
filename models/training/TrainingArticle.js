'use strict';

var Document = require('substance/model/Document');
var trainingSchema = require('./trainingSchema');

/**
  Article class
*/
var TrainingArticle = function(schema) {
  Document.call(this, schema || trainingSchema);

  // Holds a sequence of node ids
  this.create({
    type: 'container',
    id: 'body',
    nodes: []
  });
};

TrainingArticle.Prototype = function() {
  this.getDocumentMeta = function() {
    return this.get('meta');
  };
};

Document.extend(TrainingArticle);
TrainingArticle.schema = trainingSchema;

module.exports = TrainingArticle;

'use strict';

var Document = require('substance/model/Document');
var articleSchema = require('./articleSchema');

/**
  Article class
*/
var Article = function(schema) {
  Document.call(this, schema || articleSchema);

  // Holds a sequence of node ids
  this.create({
    type: 'container',
    id: 'body',
    nodes: []
  });
};

Article.Prototype = function() {
  this.getDocumentMeta = function() {
    return this.get('meta');
  };
};

Document.extend(Article);
Article.schema = articleSchema;

module.exports = Article;

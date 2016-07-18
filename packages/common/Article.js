'use strict';

var Document = require('substance/model/Document');

/*
  Basic Article model.
*/

function Article(schema) {
  Document.call(this, schema);
  this._initialize();
}

Article.Prototype = function() {

  this._initialize = function() {
    this.create({
      type: 'container',
      id: 'body',
      nodes: []
    });
  };

};

Document.extend(Article);

module.exports = Article;
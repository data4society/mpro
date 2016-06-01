'use strict';

var Document = require('substance/model/Document');
var vkSchema = require('./vkSchema');

/**
  Vk class
*/
var Vk = function(schema) {
  Document.call(this, schema || articleSchema);

  // Holds a sequence of node ids
  this.create({
    type: 'container',
    id: 'body',
    nodes: []
  });
};

Vk.Prototype = function() {
  this.getDocumentMeta = function() {
    return this.get('meta');
  };
};

Document.extend(Vk);
Vk.schema =vkSchema;

module.exports = Vk;

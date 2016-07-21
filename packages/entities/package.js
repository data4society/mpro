'use strict';

var Article = require('../common/Article');
var Person = require('./Person');
var Act = require('./Act');

module.exports = {
  name: 'entities',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-entities',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    });

    config.addNode(Person);
    config.addNode(Act);
  }
};
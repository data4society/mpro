'use strict';

var Article = require('../common/Article');
var Person = require('./Person');
var Act = require('./Act');
var Location = require('./Location');
var Organization = require('./Organization');

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
    config.addNode(Location);
    config.addNode(Organization);
  }
};
'use strict';

var Article = require('../common/Article');
var ArticleMeta = require('./ArticleMeta');
var ArticleImporter = require('./ArticleImporter');

module.exports = {
  name: 'article',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-article',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    });

    config.addNode(ArticleMeta);
    config.addImporter('article', ArticleImporter);
  }
};
'use strict';

var BasePackage = require('substance/packages/base/BasePackage');
var ParagraphPackage = require('substance/packages/paragraph/ParagraphPackage');
var HeadingPackage = require('substance/packages/heading/HeadingPackage');
var BlockquotePackage = require('substance/packages/blockquote/BlockquotePackage');
var ListPackage = require('substance/packages/list/ListPackage');
var LinkPackage = require('substance/packages/link/LinkPackage');
var EmphasisPackage = require('substance/packages/emphasis/EmphasisPackage');
var StrongPackage = require('substance/packages/strong/StrongPackage');
var EntityPackage = require('../entity/package');
var RubricatorPackage = require('../rubricator/package');

var Article = require('../common/Article');
var ArticleMeta = require('./ArticleMeta');
var ArticleImporter = require('./ArticleImporter');
var ArticleMetaComponent = require('./ArticleMetaComponent');

module.exports = {
  name: 'article',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-article',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    });

    config.addNode(ArticleMeta);
    config.addImporter('html', ArticleImporter);

    config.addComponent('meta-summary', ArticleMetaComponent);
    config.addIcon('published', { 'fontawesome': 'fa-clock-o' });
    config.addIcon('source', { 'fontawesome': 'fa-chain' });
    config.addLabel('published-by', {
      en: 'Published by',
      ru: 'Опубликовано'
    });
    config.addLabel('published-date', {
      en: ' on',
      ru: ','
    });
    config.addLabel('source', {
      en: 'Original source:',
      ru: 'Источник:'
    });

    config.import(BasePackage);
    config.import(ParagraphPackage);
    config.import(HeadingPackage);
    config.import(BlockquotePackage);
    config.import(ListPackage);
    config.import(EmphasisPackage);
    config.import(StrongPackage);
    config.import(LinkPackage);
    config.import(EntityPackage);
    config.import(RubricatorPackage);
  }
};
'use strict';

var BasePackage = require('substance/packages/base/BasePackage');
var ParagraphPackage = require('substance/packages/paragraph/ParagraphPackage');
var HeadingPackage = require('substance/packages/heading/HeadingPackage');
var BlockquotePackage = require('substance/packages/blockquote/BlockquotePackage');
var ListPackage = require('substance/packages/list/ListPackage');
var LinkPackage = require('substance/packages/link/LinkPackage');
var EmphasisPackage = require('substance/packages/emphasis/EmphasisPackage');
var StrongPackage = require('substance/packages/strong/StrongPackage');
var RubricatorPackage = require('../rubricator/package');

var Article = require('../common/Article');
var TngMeta = require('./TngMeta');
var TngMetaComponent = require('./TngMetaComponent');
var TngSeed = require('./TngSeed');

module.exports = {
  name: 'tng',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-tng',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    });

    config.addNode(TngMeta);
    config.addSeed(TngSeed);

    config.addComponent('meta-summary', TngMetaComponent);
    config.import(BasePackage);
    config.import(ParagraphPackage);
    config.import(HeadingPackage);
    config.import(BlockquotePackage);
    config.import(ListPackage);
    config.import(EmphasisPackage);
    config.import(StrongPackage);
    config.import(LinkPackage);
    config.import(RubricatorPackage);
  }
};
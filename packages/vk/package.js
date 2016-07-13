'use strict';

var BasePackage = require('substance/packages/base/BasePackage');
var ParagraphPackage = require('substance/packages/paragraph/ParagraphPackage');
var HeadingPackage = require('substance/packages/heading/HeadingPackage');
var BlockquotePackage = require('substance/packages/blockquote/BlockquotePackage');
var ListPackage = require('substance/packages/list/ListPackage');
var LinkPackage = require('substance/packages/link/LinkPackage');
var EmphasisPackage = require('substance/packages/emphasis/EmphasisPackage');
var StrongPackage = require('substance/packages/strong/StrongPackage');

var Article = require('../common/Article');
var VkMeta = require('./VkMeta');
var VkImporter = require('./VkImporter');

module.exports = {
  name: 'vk',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-vk',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    });

    config.addNode(VkMeta);
    config.addImporter('html', VkImporter);

    config.import(BasePackage);
    config.import(ParagraphPackage);
    config.import(HeadingPackage);
    config.import(BlockquotePackage);
    config.import(ListPackage);
    config.import(EmphasisPackage);
    config.import(StrongPackage);
    config.import(LinkPackage);
  }
};
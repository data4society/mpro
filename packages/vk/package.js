'use strict';

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
    config.addImporter('vk', VkImporter);
  }
};
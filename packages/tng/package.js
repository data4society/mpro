'use strict';

var Article = require('../common/Article');
var TngMeta = require('./TngMeta');
var TngImporter = require('./TngImporter');

module.exports = {
  name: 'tng',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-tng',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    });

    config.addNode(TngMeta);
    config.addImporter('tng', TngImporter);
  }
};
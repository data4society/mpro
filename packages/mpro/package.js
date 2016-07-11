'use strict';

var ProseEditorConfigurator = require('substance/packages/prose-editor/ProseEditorConfigurator');

var HeaderPackage = require('../header/package');
var FeedPackage = require('../feed/package');
var PagerPackage = require('../pager/package');
var InboxPackage = require('../inbox/package');
// var ViewerPackage = require('../viewer/package');

module.exports = {
  name: 'mpro',
  configure: function(config) {
    config.import(require('substance/packages/base/BasePackage'));
    config.import(InboxPackage);
    config.import(HeaderPackage);
    config.import(FeedPackage);
    config.import(PagerPackage);
    // // Default configuration for available modes
    // config.addConfigurator('viewer', new ProseEditorConfigurator().import(ViewerPackage));
  }
};
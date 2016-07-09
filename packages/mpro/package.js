'use strict';

var ProseEditorConfigurator = require('substance/packages/prose-editor/ProseEditorConfigurator');

// var InboxPackage = require('../inbox/package');
// var ViewerPackage = require('../viewer/package');

module.exports = {
  name: 'mpro',
  configure: function(config) {
    // config.import(InboxPackage);
    // // Default configuration for available modes
    // config.addConfigurator('viewer', new ProseEditorConfigurator().import(ViewerPackage));
  }
};
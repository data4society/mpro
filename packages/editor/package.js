'use strict';

var CoverPackage = require('../cover/package');
var Editor = require('./Editor');
var EditorToolbar = require('./EditorToolbar');
var Overlay = require('substance/ui/Overlay');

module.exports = {
  name: 'editor',
  configure: function(config) {
    config.import(CoverPackage);
    config.addComponent('editor', Editor);
    config.setToolbarClass(EditorToolbar);
    config.addComponent('overlay', Overlay);
    
    config.addStyle(__dirname, '_editor');
  }
};
'use strict';

var Viewer = require('./Viewer');
var ProseEditorToolbar = require('substance/packages/prose-editor/ProseEditorToolbar');
var Overlay = require('substance/ui/Overlay');

module.exports = {
  name: 'viewer',
  configure: function(config) {
    config.addComponent('viewer', Viewer);
    config.setToolbarClass(ProseEditorToolbar);
    config.addComponent('overlay', Overlay);
    
    config.addStyle(__dirname, '_viewer');
  }
};
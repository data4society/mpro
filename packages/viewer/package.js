'use strict';

var Viewer = require('./Viewer');
var ViewerToolbar = require('./ViewerToolbar');
var Overlay = require('substance/ui/Overlay');

module.exports = {
  name: 'viewer',
  configure: function(config) {
    config.addComponent('viewer', Viewer);
    config.setToolbarClass(ViewerToolbar);
    config.addComponent('overlay', Overlay);
    
    config.addStyle(__dirname, '_viewer');
  }
};
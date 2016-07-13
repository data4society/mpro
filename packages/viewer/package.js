'use strict';

var Viewer = require('./Viewer');

module.exports = {
  name: 'viewer',
  configure: function(config) {
    config.addComponent('viewer', Viewer);
    config.addStyle(__dirname, '_viewer');
  }
};
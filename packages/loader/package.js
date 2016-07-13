'use strict';

var Loader = require('./Loader');

module.exports = {
  name: 'loader',
  configure: function(config) {
    config.addComponent('loader', Loader);
    config.addStyle(__dirname, '_loader');
  }
};
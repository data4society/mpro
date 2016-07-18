'use strict';

var Filters = require('./Filters');

module.exports = {
  name: 'filters',
  configure: function(config) {
    config.addComponent('filters', Filters);
    config.addStyle(__dirname, '_filters');
  }
};
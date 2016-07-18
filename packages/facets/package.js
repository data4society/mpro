'use strict';

var Facets = require('./Facets');

module.exports = {
  name: 'facets',
  configure: function(config) {
    config.addComponent('facets', Facets);
    config.addStyle(__dirname, '_facets');

    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' });
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' });
  }
};
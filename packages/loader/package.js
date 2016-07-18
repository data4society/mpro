'use strict';

var Loader = require('./Loader');

module.exports = {
  name: 'loader',
  configure: function(config) {
    config.addComponent('loader', Loader);
    config.addStyle(__dirname, '_loader');
    config.addLabel('no-document', {
      en: 'Click on document to open',
      ru: 'Нажмите на документ для открытия'
    });
  }
};
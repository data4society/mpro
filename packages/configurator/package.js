'use strict';

var Configurator = require('./Configurator');

module.exports = {
  name: 'configurator',
  configure: function(config) {
    config.addComponent('configurator', Configurator);
    config.addStyle(__dirname, '_configurator');

    config.addLabel('inbox-menu', {
      en: 'Inbox',
      ru: 'Входящие'
    });
    config.addLabel('import-menu', {
      en: 'Import',
      ru: 'Импорт'
    });
  }
};
'use strict';

var Inbox = require('./Inbox');

module.exports = {
  name: 'inbox',
  configure: function(config) {
    config.addComponent('inbox', Inbox);
    config.addStyle(__dirname, '_inbox');

    config.addLabel('configurator-menu', {
      en: 'Configurator',
      ru: 'Конфигуратор'
    });
  }
};
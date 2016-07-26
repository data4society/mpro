'use strict';

var Form = require('./Form');

module.exports = {
  name: 'forms',
  configure: function(config) {
    config.addComponent('form', Form);
    config.addStyle(__dirname, '_forms');
    config.addStyle(__dirname, '_multiple');
    config.addStyle(__dirname, '_reference');
    config.addStyle(__dirname, '_select');

    config.addLabel('reference-empty-value', {
      en: 'No values matching your query',
      ru: 'Ой, ничего не нашлось'
    });
    config.addLabel('reference-select', {
      en: 'Select value',
      ru: 'Выберите значение'
    });
  }
};
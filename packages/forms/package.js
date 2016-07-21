'use strict';

var Form = require('./Form');

module.exports = {
  name: 'forms',
  configure: function(config) {
    config.addComponent('form', Form);
    config.addStyle(__dirname, '_forms');
  }
};
'use strict';

var Welcome = require('./Welcome');
var LoginStatus = require('./LoginStatus');

module.exports = {
  name: 'welcome',
  configure: function(config) {
    config.addComponent('welcome', Welcome);
    config.addComponent('login-status', LoginStatus);
    config.addStyle(__dirname, '_welcome');
    config.addStyle(__dirname, '_request-login');
    config.addStyle(__dirname, '_login-status');

    config.addLabel('welcome-title', {
      en: 'Monitoring Pro',
      ru: 'Monitoring Pro'
    });
    config.addLabel('welcome-about', {
      en: 'Monitoring Pro is a tool for search, attribution and extracting data from the incoming web-resources, as well as a tool for further analysis of this data.',
      ru: 'Monitoring Pro — инструмент поиска, аттрибуции и извлечения данных из публикаций, это также инструмент аналализа полученных данных'
    });
    config.addLabel('welcome-no-passwords', {
      en: 'How to login?',
      ru: 'Как войти?'
    });
    config.addLabel('welcome-howto-login', {
      en: 'Well, currently the only option is to click on <a href="/#loginKey=1234">this link</a>.',
      ru: 'К сожалению в настоящий момент это можно сделать только пройдя по <a href="/#loginKey=1234">этой ссылке</a>.'
    });
    config.addLabel('welcome-enter-email', {
      en: 'Later you\'ll be able to request login via next form or enter password.',
      ru: 'Позже вы сможете зайти запросив доступ в форме ниже или введя пароль'
    });
    config.addLabel('welcome-submit', {
      en: 'Request login',
      ru: 'Получить доступ'
    });
  }
};
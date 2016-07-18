'use strict';

var Cover = require('./Cover');
var Summary = require('./Summary');

module.exports = {
  name: 'cover',
  configure: function(config) {
    config.addComponent('cover', Cover);
    config.addComponent('summary', Summary);
    config.addStyle(__dirname, '_cover');
    config.addStyle(__dirname, '_summary');
    config.addIcon('rubrics', { 'fontawesome': 'fa-tags' });
    config.addLabel('no-rubrics', {
      en: 'No rubrics were attached to this document',
      ru: 'Этот документ не связан ни с одной рубрикой'
    });
  }
};
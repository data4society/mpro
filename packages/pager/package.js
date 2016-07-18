'use strict';

var Pager = require('./Pager');

module.exports = {
  name: 'pager',
  configure: function(config) {
    config.addComponent('pager', Pager);
    config.addStyle(__dirname, '_pager');

    config.addLabel('load-more', {
      en: 'Load more',
      ru: 'Загрузить еще'
    });
  }
};
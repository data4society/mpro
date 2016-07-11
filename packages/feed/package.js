'use strict';

var Feed = require('./Feed');
var FeedItem = require('./FeedItem');

module.exports = {
  name: 'feed',
  configure: function(config) {
    config.addComponent('feed', Feed);
    config.addComponent('feedItem', FeedItem);
    config.addStyle(__dirname, '_feed');
    config.addStyle(__dirname, '_feed-item');
    
    // Counter phrase endings
    config.addLabel('counter0', {
      en: 'No documents found',
      ru: 'Не найдено ни одного документа'
    });
    config.addLabel('counter1', {
      en: 'document found',
      ru: 'документ найден'
    });
    config.addLabel('counter4', {
      en: 'documents found',
      ru: 'документа найдено'
    });
    config.addLabel('counter5', {
      en: 'documents found',
      ru: 'документов найдено'
    });
    // Empty feed phrase
    config.addLabel('empty-feed', {
      en: 'Sorry, we have no documents matching your query',
      ru: 'Ой, кажется нам нечем ответить на ваш запрос'
    });

    config.addIcon('rubrics', { 'fontawesome': 'fa-tags' });
    config.addIcon('vk', { 'fontawesome': 'fa-vk' });
  }
};
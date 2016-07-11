'use strict';

var Inbox = require('./Inbox');

module.exports = {
  name: 'inbox',
  configure: function(config) {
    config.addComponent('inbox', Inbox);
  }
};
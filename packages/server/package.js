'use strict';

var config = require('config');
var extend = require('lodash/extend');
var ServerConfig = extend({}, config.get('server'), {env: config.util.getEnv('NODE_ENV')});

var SubConfigurator = require('../common/SubConfigurator');
var ArticlePackage = require('../article/package');
var ArticleImporter = require('../article/ArticleImporter');
var TngPackage = require('../tng/package');
var TngImporter = require('../tng/TngImporter');
var VkPackage = require('../vk/package');
var VkImporter = require('../vk/VkImporter');

var articleConfigurator = new SubConfigurator().import(ArticlePackage);
articleConfigurator.addImporter('html', ArticleImporter);

var tngConfigurator = new SubConfigurator().import(TngPackage);
tngConfigurator.addImporter('html', TngImporter);

var vkConfigurator = new SubConfigurator().import(VkPackage);
vkConfigurator.addImporter('html', VkImporter);

module.exports = {
  name: 'server',
  configure: function(config) {
    config.addConfigurator('mpro-article', articleConfigurator);
    config.addConfigurator('mpro-tng', tngConfigurator);
    config.addConfigurator('mpro-vk', vkConfigurator);
    config.setAppConfig(ServerConfig);
  }
};
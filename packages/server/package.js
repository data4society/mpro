let config = require('config')
let extend = require('lodash/extend')
let ServerConfig = extend({}, config.get('server'), {env: config.util.getEnv('NODE_ENV')})

// We will impor CommonJS versions of schemas as node.js 
// still not support ES2015 import and export statements
// TODO: switch back after node.js v7 release
let SubConfigurator = require('./ServerConfigurator')
let ArticlePackage = require('./schemas/article/package')
let ArticleImporter = require('./schemas/article/ArticleImporter')
let TngPackage = require('./schemas/tng/package')
let TngImporter = require('./schemas/tng/TngImporter')
let VkPackage = require('./schemas/vk/package')
let VkImporter = require('./schemas/vk/VkImporter')

let articleConfigurator = new SubConfigurator().import(ArticlePackage)
articleConfigurator.addImporter('html', ArticleImporter)

let tngConfigurator = new SubConfigurator().import(TngPackage)
tngConfigurator.addImporter('html', TngImporter)

let vkConfigurator = new SubConfigurator().import(VkPackage)
vkConfigurator.addImporter('html', VkImporter)

module.exports = {
  name: 'server',
  configure: function(config) {
    config.addConfigurator('mpro-article', articleConfigurator)
    config.addConfigurator('mpro-tng', tngConfigurator)
    config.addConfigurator('mpro-vk', vkConfigurator)
    config.setAppConfig(ServerConfig)
  }
}
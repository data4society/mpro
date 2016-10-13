let config = require('config')
let extend = require('lodash/extend')
let ServerConfig = extend({}, config.get('server'), {env: config.util.getEnv('NODE_ENV')})

let SubConfigurator = require('../common/SubConfigurator')
let ArticlePackage = require('../article/package')
let ArticleImporter = require('../article/ArticleImporter')
let TngPackage = require('../tng/package')
let TngImporter = require('../tng/TngImporter')
let VkPackage = require('../vk/package')
let VkImporter = require('../vk/VkImporter')

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
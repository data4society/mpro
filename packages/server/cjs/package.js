// We will impor CommonJS versions of schemas as node.js 
// still not support ES2015 import and export statements
// TODO: switch back after node.js v7 release
let SubConfigurator = require('../../common/ServerConfigurator')
let ArticlePackage = require('./article/package')
let ArticleImporter = require('./article/ArticleImporter')
let TngPackage = require('./tng/package')
let TngImporter = require('./tng/TngImporter')
let VkPackage = require('./vk/package')
let VkImporter = require('./vk/VkImporter')

let articleConfigurator = new SubConfigurator().import(ArticlePackage)
articleConfigurator.addImporter('html', ArticleImporter)

let tngConfigurator = new SubConfigurator().import(TngPackage)
tngConfigurator.addImporter('html', TngImporter)

let vkConfigurator = new SubConfigurator().import(VkPackage)
vkConfigurator.addImporter('html', VkImporter)

module.exports = {
  name: 'mpro-cjs-schemas',
  configure: function(config) {
    config.addConfigurator('mpro-article', articleConfigurator)
    config.addConfigurator('mpro-tng', tngConfigurator)
    config.addConfigurator('mpro-vk', vkConfigurator)
  }
}
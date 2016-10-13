let Article = require('../common/Article')
let VkMeta = require('./VkMeta')

let BlockquotePackage = require('substance').BlockquotePackage
let EmphasisPackage = require('substance').EmphasisPackage
let HeadingPackage = require('substance').HeadingPackage
let LinkPackage = require('substance').LinkPackage
let ListPackage = require('substance').ListPackage
let ParagraphPackage = require('substance').ParagraphPackage
let StrongPackage = require('substance').StrongPackage

let EntityPackage = require('../entity/package')
let RubricatorPackage = require('../rubricator/package')

module.exports = {
  name: 'vk',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-vk',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    })

    config.addNode(VkMeta)

    // Import Substance Core packages
    config.import(ParagraphPackage)
    config.import(HeadingPackage)
    config.import(BlockquotePackage)
    config.import(ListPackage)
    config.import(EmphasisPackage)
    config.import(StrongPackage)
    config.import(LinkPackage)

    // Import mpro specific packages    
    config.import(EntityPackage)
    config.import(RubricatorPackage)

    config.addIcon('published', { 'fontawesome': 'fa-clock-o' });
    config.addIcon('source', { 'fontawesome': 'fa-chain' });
    config.addLabel('published-by', {
      en: 'Published by',
      ru: 'Опубликовано'
    })
    config.addLabel('published-date', {
      en: ' on',
      ru: ','
    })
    config.addLabel('source', {
      en: 'Original source:',
      ru: 'Источник:'
    })
  }
}

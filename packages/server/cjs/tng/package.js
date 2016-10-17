let Article = require('../common/Article')
let TngMeta = require('./TngMeta')

let BlockquotePackage = require('substance').BlockquotePackage
let EmphasisPackage = require('substance').EmphasisPackage
let HeadingPackage = require('substance').HeadingPackage
let LinkPackage = require('substance').LinkPackage
let ParagraphPackage = require('substance').ParagraphPackage
let StrongPackage = require('substance').StrongPackage

module.exports = {
  name: 'tng',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-tng',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    })

    config.addNode(TngMeta)

    // Import Substance Core packages
    config.import(ParagraphPackage)
    config.import(HeadingPackage)
    config.import(BlockquotePackage)
    config.import(EmphasisPackage)
    config.import(StrongPackage)
    config.import(LinkPackage)
  }
}

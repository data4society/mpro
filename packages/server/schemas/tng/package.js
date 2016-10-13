let Article = require('../common/Article')
let TngMeta = require('./TngMeta')

let BlockquotePackage = require('substance').BlockquotePackage
let EmphasisPackage = require('substance').EmphasisPackage
let HeadingPackage = require('substance').HeadingPackage
let LinkPackage = require('substance').LinkPackage
let ListPackage = require('substance').ListPackage
let ParagraphPackage = require('substance').ParagraphPackage
let StrongPackage = require('substance').StrongPackage

let AcceptorPackage = require('../acceptor/package')
let RubricatorPackage = require('../rubricator/package')

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
    config.import(ListPackage)
    config.import(EmphasisPackage)
    config.import(StrongPackage)
    config.import(LinkPackage)

    // Import mpro specific packages    
    config.import(AcceptorPackage)
    config.import(RubricatorPackage)
  }
}

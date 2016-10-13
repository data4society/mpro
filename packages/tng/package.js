import Article from '../common/Article'
import TngMeta from './TngMeta'
import TngMetaComponent from './TngMetaComponent'
import TngSeed from './TngSeed'

import { BlockquotePackage, EmphasisPackage, HeadingPackage, LinkPackage, ListPackage, ParagraphPackage, StrongPackage } from 'substance'

import AcceptorPackage from '../acceptor/package'
import RubricatorPackage from '../rubricator/package'

export default {
  name: 'tng',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-tng',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    })

    config.addNode(TngMeta)
    config.addSeed(TngSeed)

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

    config.addComponent('meta-summary', TngMetaComponent)
  }
}

import Article from '../common/Article'
import ArticleMeta from './ArticleMeta'
import ArticleMetaComponent from './ArticleMetaComponent'
import ArticleSeed from './ArticleSeed'

import { BlockquotePackage, EmphasisPackage, HeadingPackage, LinkPackage, ParagraphPackage, StrongPackage } from 'substance'

import EntityPackage from '../entity/package'
import RubricatorPackage from '../rubricator/package'

export default {
  name: 'article',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-article',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    })
    config.addNode(ArticleMeta)
    config.addSeed(ArticleSeed)

    // Import Substance Core packages
    config.import(ParagraphPackage)
    config.import(HeadingPackage)
    config.import(BlockquotePackage)
    config.import(EmphasisPackage)
    config.import(StrongPackage)
    config.import(LinkPackage)

    // Import mpro specific packages    
    config.import(EntityPackage)
    config.import(RubricatorPackage)

    config.addComponent('meta-summary', ArticleMetaComponent)
    config.addIcon('published', { 'fontawesome': 'fa-clock-o' })
    config.addIcon('source', { 'fontawesome': 'fa-chain' })
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

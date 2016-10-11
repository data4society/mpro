import Article from '../common/Article'
import Person from './Person'
import Act from './Act'
import Location from './Location'
import Organization from './Organization'

export default {
  name: 'entities',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-entities',
      ArticleClass: Article,
      defaultTextType: 'paragraph'
    })

    config.addNode(Person)
    config.addNode(Act)
    config.addNode(Location)
    config.addNode(Organization)
  }
}
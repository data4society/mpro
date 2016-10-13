import Rubrics from './Rubrics'
import Rubric from './Rubric'
import RubricConverter from './RubricConverter'
import RubricsImporter from './RubricsImporter'

export default {
  name: 'rubric',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-rubrics',
      ArticleClass: Rubrics,
      defaultTextType: 'paragraph'
    })

    config.addNode(Rubric)
    config.addConverter('rubrics', RubricConverter)
    config.addImporter('rubrics', RubricsImporter)
  }
}

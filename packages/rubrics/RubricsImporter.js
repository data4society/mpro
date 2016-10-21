import { HTMLImporter } from 'substance'
import each from 'lodash/each'

let converters = []

class RubricsImporter extends HTMLImporter {

  importDocument(rubricsData, facets) {
    this.reset()
    //this.convertDocument(articleEl);
    let doc = this.generateDocument()
    each(rubricsData, function(rubric) {
      let active = false
      if(facets.indexOf(rubric.rubric_id) > -1) {
        active = true
      }
      doc.create({
        id: rubric.rubric_id,
        type: 'rubric',
        name: rubric.name,
        count: rubric.cnt,
        description: rubric.description,
        parent: rubric.parent_id,
        active: active
      })
    })

    return doc
  }

  /*
    Takes an HTML string.
  */
  convertDocument(bodyEls) {
    // Just to make sure we always get an array of elements
    if (!bodyEls.length) bodyEls = [bodyEls]
    this.convertContainer(bodyEls, 'body')
  }
}

RubricsImporter.converters = converters

export default RubricsImporter

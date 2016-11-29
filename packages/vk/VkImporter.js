import { DefaultDOMElement, HTMLImporter } from 'substance'
import sanitizeHtml from 'sanitize-html'
import each from 'lodash/each'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'

class VkImporter extends HTMLImporter {

  importDocument(html, source) {

    html = html.replace(/&#13;/g, '').replace(/<br ?\/?>|<\/p>|<\/div>/g, '\n')

    let clean = sanitizeHtml(html, {
      allowedTags: [ /*'p',*/ 'b', 'i', 'em', 'strong', 'a' ],
      allowedAttributes: {
        'a': [ 'href' ]
      }
    })

    clean = clean.split('\n')

    for (let i = 0; i < clean.length; i++) {
      clean[i] = clean[i].trim()
      if (clean[i] === "") {         
        clean.splice(i, 1)
        i--
      }
    }

    clean = clean.join('</p><p>')
    clean = "<p>" + clean + "</p>"

    this.reset()
    let parsed = DefaultDOMElement.parseHTML(clean)
    this.convertDocument(parsed)
    let doc = this.generateDocument()

    this.convertEntities(doc, source.markup)
    // Create document metadata
    this.convertMeta(doc, source)

    return doc
  }

  convertDocument(els) {
    if (!els.length) els = [els]
    this.convertContainer(els, 'body')
  }

  convertMeta(doc, source) {
    let meta = source.meta
    let owner = meta.vk_owner
    let author_name

    // Compile first and last names for users and name for other cases
    if(owner.owner_type === "user") {
      author_name = owner.first_name + " " + owner.last_name
    } else {
      author_name = owner.name
    }

    // Create array of objects with type and src url
    let attachments = map(meta.vk_attachments, function(attachment) {
      let type = attachment.type
      let src = ""
      if(attachment[type]) src = attachment[type].src
      return {
        type: type,
        src: src
      }
    })

    let entities = []
    let entityAnnos = doc.getIndex('annotations').byType.entity
    each(entityAnnos, function(anno) {
      entities.push(anno.reference)
    })
    entities = uniq(entities)

    let published = new Date(source.published_date)
    let abstract = source.doc_source.substr(0, source.doc_source.indexOf('<br>'))
    abstract = this.truncate(abstract, 200, true)
    let metaNode = doc.get('meta')
    if(!metaNode){
      doc.create({
        id: 'meta',
        type: 'meta',
        title: '',
        source: source.url,
        published: published.toJSON(),
        created: new Date().toJSON(),
        rubrics: source.rubric_ids,
        entities: entities,
        abstract: abstract,
        post_type: meta.vk_post_type,
        author: {
          name: author_name,
          url: owner.owner_url
        },
        attachments: attachments
      })
    }
  }

  convertEntities(doc, markup) {
    let nodeList = doc.get(['body', 'nodes'])
    let nodes = []

    let pos = 0

    each(nodeList, function(nodeId) {
      let node = doc.get(nodeId)
      let length = node.content.length
      node.startPos = pos
      node.endPos = pos + length
      nodes.push(node)
      pos += length
    })

    each(markup, function(ref, id) {
      let node = find(nodes, function(n) { return n.startPos <= ref.start_offset && n.endPos >= ref.start_offset; })
      if(node) {
        let startOffset = ref.start_offset - node.startPos
        let endOffset = startOffset + ref.end_offset - ref.start_offset
        doc.create({
          id: 'entity-' + id,
          type: 'entity',
          path: [node.id, 'content'],
          reference: ref.entity,
          entityClass: ref.class,
          startOffset: startOffset,
          endOffset: endOffset
        })
      }
    })
  }

  truncate(string, n, useWordBoundary) {
    let isTooLong = string.length > n
    let s_ = isTooLong ? string.substr(0,n-1) : string
    s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_
    return isTooLong ? s_ + '&hellip;' : s_
  }
}

export default VkImporter

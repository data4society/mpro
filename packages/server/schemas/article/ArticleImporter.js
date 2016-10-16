let sanitizeHtml = require('sanitize-html')
let DefaultDOMElement = require('substance').DefaultDOMElement
let HTMLImporter = require('substance').HTMLImporter
let each = require('lodash/each')
let find = require('lodash/find')

class ArticleImporter extends HTMLImporter {

  importDocument(html, source) {
    // move all trailing spaces after tag closing first
    // e.g. " </strong>" should be turned to "</strong> "
    html = html.replace(/\s+<\/([a-z]+)>/g,"</$1> ").replace(/<br ?\/?>|<\/p>|<\/div>/g, '\n')


    let clean = sanitizeHtml(html, {
      allowedTags: [ 'b', 'i', 'em', 'strong', 'a'],
      allowedAttributes: {
        'a': [ 'href' ]
      }
    })

    clean = clean.split('\n')

    for (var i = 0; i < clean.length; i++) {
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
    // Create document metadata
    this.convertMeta(doc, source)

    this.convertEntities(doc, source.markup)
    return doc
  }

  convertDocument(els) {
    if (!els.length) els = [els]
    this.convertContainer(els, 'body')
  }

  convertMeta(doc, source) {
    let meta = source.meta
    let publisher = meta.publisher
    let published = new Date(source.published_date)

    let metaNode = doc.get('meta')
    if(!metaNode){
      doc.create({
        id: 'meta',
        type: 'meta',
        title: source.title,
        source: source.guid,
        published: published.toJSON(),
        rubrics: source.rubric_ids,
        entities: [],
        abstract: meta.abstract,
        cover: '',
        publisher: publisher.name
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
}

module.exports = ArticleImporter
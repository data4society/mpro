import { DefaultDOMElement, HTMLImporter } from 'substance'
import sanitizeHtml from 'sanitize-html'

class TngImporter extends HTMLImporter {

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

    // Hack, should be replaced
    let source_type = source.guid.indexOf('vk.com') > -1 ? 'vk' : 'article'
    let abstract = source.doc_source.substr(0, source.doc_source.indexOf('<br>'))
    abstract = this.truncate(abstract, 200, true)

    if(meta.abstract) abstract = meta.abstract

    let metaNode = doc.get('meta')
    if(!metaNode){
      doc.create({
        id: 'meta',
        type: 'meta',
        title: source.title || '',
        rubrics: source.rubric_ids,
        source_type: source_type,
        entities: [],
        abstract: abstract,
        accepted: false
      })
    }
  }

  truncate(string, n, useWordBoundary) {
    let isTooLong = string.length > n
    let s_ = isTooLong ? string.substr(0,n-1) : string
    s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_
    return isTooLong ? s_ + '&hellip;' : s_
  }
}

export default TngImporter

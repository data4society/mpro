import { Component, TextPropertyEditor } from 'substance'
import DocumentSummary from './Summary'

class Cover extends Component {

  didMount() {
    let doc = this.getDocument()
    doc.on('document:changed', this._onDocumentChanged, this)
  }

  dispose() {
    let doc = this.getDocument()
    doc.off(this)
  }

  render($$) {
    // var documentInfo = this.props.documentInfo.props;
    // var authors = [documentInfo.author || documentInfo.userId];
    // authors = authors.concat(documentInfo.collaborators);
   
    let el = $$("div").addClass("sc-cover")

    el.append(
      // Editable title
      $$(TextPropertyEditor, {
        name: 'title',
        path: ["meta", "title"],
        disabled: this.props.editing !== 'full'
      }).addClass('se-title'),
      $$('div').addClass('se-separator'),
      $$(DocumentSummary, {
        mobile: this.props.mobile,
        documentInfo: this.props.documentInfo,
        rubrics: this.props.rubrics,
        editing: this.props.editing || 'full'
      })
    )

    return el
  }

  _onDocumentChanged(change) {
    let doc = this.props.doc
    let meta = doc.get('meta')
    let documentInfo = this.props.documentInfo
    let documentId = documentInfo.props.documentId
    
    // HACK: update the updatedAt property
    documentInfo.props.updatedAt = new Date()
    documentInfo.props.meta = {title: meta.title, rubrics: meta.rubrics}

    if (change.updated['meta,rubrics']) {
      this.rerender()
    }

    let changed = Object.keys(change.updated)[0]
    let metaChanged = changed.indexOf('meta') > -1

    if(metaChanged) {
      this.send('updateFeedItem', documentId, meta.toJSON())
    }
  }

  getDocument() {
    return this.props.doc
  }
}

export default Cover

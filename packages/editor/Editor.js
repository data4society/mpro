import { ContainerEditor, Layout, ProseEditor, ProseEditorOverlayTools, ScrollPane, SplitPane } from 'substance'
import isUndefined from 'lodash/isUndefined'
import each from 'lodash/each'

class Editor extends ProseEditor {

  render($$) {
    let el = $$('div').addClass('sc-document-editor')

    let toolbar = this._renderToolbar($$)
    let editor = this._renderEditor($$)
    let cover = this._renderCover($$)

    let contentPanel = $$(ScrollPane, {
      scrollbarType: 'substance',
      scrollbarPosition: 'right',
      overlay: ProseEditorOverlayTools,
    }).append(
      $$(Layout, {
        width: 'large'
      }).append(
        cover,
        editor
      )
    ).ref('contentPanel')

    el.append(
      $$(SplitPane, {splitType: 'horizontal'}).append(
        toolbar,
        contentPanel
      )
    )
    return el
  }

  _renderEditor($$) {
    let configurator = this.props.configurator
    return $$(ContainerEditor, {
      disabled: this.props.disabled,
      documentSession: this.documentSession,
      node: this.doc.get('body'),
      editing: 'full',
      commands: configurator.getSurfaceCommandNames(),
      textTypes: configurator.getTextTypes()
    }).ref('body')
  }

  _renderCover($$) {
    let componentRegistry = this.componentRegistry
    let Cover = componentRegistry.get('cover')
    return $$(Cover, {
      doc: this.doc,
      mobile: this.props.mobile,
      editing: 'full',
      documentInfo: this.props.documentInfo,
      rubrics: this.props.rubrics
    }).ref('cover')
  }

  documentSessionUpdated(update) {
    if(!isUndefined(update.change)) {
      let accepted = this.doc.get(['meta', 'accepted'])
      let moderated = this.doc.get(['meta', 'moderated'])

      if(update.change.updated['meta,accepted'] === true) {
        if(accepted) {
          this._exportDocument()
        }
      }

      if(update.change.updated['meta,moderated'] === true) {
        if(moderated && accepted) {
          this._exportDocument()
        }
      }

      if(update.change.updated['meta,rubrics'] === true) {
        let surface = this.surfaceManager.getSurface('body')
        surface.transaction(function(tx, args) {
          tx.set(['meta', 'accepted'], false)
          tx.set(['meta', 'moderated'], false)
          return args
        })
      }
    }

    let toolbar = this.refs.toolbar
    if (toolbar) {
      let commandStates = this.commandManager.getCommandStates()
      toolbar.setProps({
        commandStates: commandStates
      })
    }
  }

  _exportDocument() {
    let documentId = this.documentSession.documentId
    let documentClient = this.context.documentClient
    let entities = this.doc.get(['meta', 'entities'])
    let rubrics = this.doc.get(['meta', 'rubrics'])
    let plain = []
    each(this.doc.getNodes(), function(node) {
      if (node.isText()) {
        plain.push(node.getText())
      }
    })
    plain = plain.join('\n')
    let sourceData = {
      entity_ids: entities,
      rubric_ids: rubrics,
      stripped: plain.replace(/\xA0/g,' ')
    }

    documentClient.updateSource(documentId, sourceData, function(err) {
      if(err) {
        console.error(err);
      }
    })
  }
}

export default Editor

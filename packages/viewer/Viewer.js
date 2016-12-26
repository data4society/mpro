import { ContainerEditor, Layout, ProseEditor, ProseEditorOverlayTools, ScrollPane, SplitPane } from 'substance'
import each from 'lodash/each'
import isEqual from 'lodash/isEqual'
import isUndefined from 'lodash/isUndefined'
import uniq from 'lodash/uniq'

class Viewer extends ProseEditor {

  getComponentRegistry() {
    return this.props.configurator.getComponentRegistry()
  }

  render($$) {
    let el = $$('div').addClass('sc-document-viewer')

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
      editing: 'selection',
      commands: configurator.getSurfaceCommandNames(),
      textTypes: configurator.getTextTypes()
    }).ref('body')
  }

  _renderCover($$) {
    let Cover = this.getComponent('cover')

    return $$(Cover, {
      doc: this.doc,
      mobile: this.props.mobile,
      editing: 'readonly',
      documentInfo: this.props.documentInfo,
      rubrics: this.props.rubrics
    }).ref('cover')
  }

  documentSessionUpdated(update) {
    if(!isUndefined(update.change)) {
      let ops = update.change.ops
      let entityChange = false
      let rubricsChange = false
      let accepted = this.doc.get(['meta', 'accepted'])
      let moderated = this.doc.get(['meta', 'moderated'])
      let surface = this.surfaceManager.getSurface('body')

      each(ops, function(op) {
        if(op.val.type === 'entity') {
          entityChange = true
          return
        }
      })

      each(ops, function(op) {
        if(op.path[1] === 'rubrics') {
          if(!isEqual(op.original, op.val)) {
            rubricsChange = true
          }
          return
        }
      })

      if(entityChange) {
        this.updateEntitiesList()
      }

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

      if(rubricsChange) {
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

  updateEntitiesList() {
    let doc = this.doc
    let entities = []
    let entityAnnos = doc.getIndex('annotations').byType.entity
    each(entityAnnos, function(anno) {
      entities.push(anno.reference)
    })
    entities = uniq(entities)

    let surface = this.surfaceManager.getFocusedSurface()
    surface.transaction(function(tx, args) {
      tx.set(['meta', 'entities'], entities)
      return args
    })
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
      stripped: plain.replace(/\s/g,' ').replace(/&nbsp;/g,' ')
    }

    documentClient.updateSource(documentId, sourceData, function(err) {
      if(err) {
        console.error(err);
      }
    })
  }
}

export default Viewer

import { ContainerEditor, Layout, ProseEditor, ProseEditorOverlayTools, ScrollPane, SplitPane } from 'substance'

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
}

export default Viewer

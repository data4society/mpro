'use strict';

var ProseEditor = require('substance/packages/prose-editor/ProseEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Layout = require('substance/ui/Layout');
var ProseEditorOverlay = require('substance/packages/prose-editor/ProseEditorOverlay')

function Editor() {
  Editor.super.apply(this, arguments);
}

Editor.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-document-editor');

    var toolbar = this._renderToolbar($$);
    var editor = this._renderEditor($$);
    var cover = this._renderCover($$);

    var contentPanel = $$(ScrollPane, {
      scrollbarType: 'substance',
      scrollbarPosition: 'right',
      overlay: ProseEditorOverlay,
    }).append(
      $$(Layout, {
        width: 'large'
      }).append(
        cover,
        editor
      )
    ).ref('contentPanel');

    el.append(
      $$(SplitPane, {splitType: 'horizontal'}).append(
        toolbar,
        contentPanel
      )
    );
    return el;
  };

  this._renderEditor = function($$) {
    var configurator = this.props.configurator;
    return $$(ContainerEditor, {
      disabled: this.props.disabled,
      documentSession: this.documentSession,
      node: this.doc.get('body'),
      editing: 'full',
      commands: configurator.getSurfaceCommandNames(),
      textTypes: configurator.getTextTypes()
    }).ref('body');
  };

  this._renderCover = function($$) {
    var configurator = this.props.configurator;
    var componentRegistry = this.componentRegistry;
    var Cover = componentRegistry.get('cover');
    return $$(Cover, {
      doc: this.doc,
      mobile: this.props.mobile,
      editing: 'full',
      documentInfo: this.props.documentInfo,
      rubrics: this.props.rubrics
    }).ref('cover');
  };

};

ProseEditor.extend(Editor);

module.exports = Editor;
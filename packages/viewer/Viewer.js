'use strict';

var ProseEditor = require('substance/packages/prose-editor/ProseEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var ProseEditorOverlay = require('substance/packages/prose-editor/ProseEditorOverlay')

function Viewer() {
  Viewer.super.apply(this, arguments);
}

Viewer.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-document-viewer');

    var toolbar = this._renderToolbar($$);
    var editor = this._renderEditor($$);

    var contentPanel = $$(ScrollPane, {
      scrollbarType: 'substance',
      scrollbarPosition: 'right',
      overlay: ProseEditorOverlay,
    }).append(
      editor
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
      editing: 'selection',
      commands: configurator.getSurfaceCommandNames(),
      textTypes: configurator.getTextTypes()
    }).ref('body');
  };

};

ProseEditor.extend(Viewer);

module.exports = Viewer;
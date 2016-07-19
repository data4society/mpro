'use strict';

var ProseEditor = require('substance/packages/prose-editor/ProseEditor');
var ContainerEditor = require('substance/ui/ContainerEditor');
var SplitPane = require('substance/ui/SplitPane');
var ScrollPane = require('substance/ui/ScrollPane');
var Layout = require('substance/ui/Layout');
var ProseEditorOverlay = require('substance/packages/prose-editor/ProseEditorOverlay');
var isUndefined = require('lodash/isUndefined');
var each = require('lodash/each');

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

  this._documentSessionUpdated = function(update) {
    if(!isUndefined(update.change)) {
      var accepted = this.doc.get(['meta', 'accepted']);
      if(update.change.updated['meta,accepted'] === true) {
        if(accepted) {
          this._exportDocument();
        } 
      } else if (accepted) {
        var surface = this.surfaceManager.getFocusedSurface();
        surface.transaction(function(tx, args) {
          tx.set(['meta', 'accepted'], false);
          return args;
        }); 
      }
    }

    var toolbar = this.getToolbar();
    if (toolbar) {
      var commandStates = this.commandManager.getCommandStates();
      this.refs.toolbar.setProps({
        commandStates: commandStates
      });
    }
  };

  this._exportDocument = function() {
    var documentId = this.documentSession.documentId;
    var documentClient = this.context.documentClient;
    var rubrics = this.doc.get(['meta', 'rubrics']);
    var plain = [];
    each(this.doc.getNodes(), function(node) {
      if (node.isText()) {
        plain.push(node.getText());
      }
    });
    plain = plain.join('\n');
    var sourceData = {
      rubric_ids: rubrics,
      stripped: plain
    };

    documentClient.updateSource(documentId, sourceData, function(err) {
      if(err) {
        console.error(err);
        var surface = this.surfaceManager.getFocusedSurface();
        surface.transaction(function(tx, args) {
          tx.set(['meta', 'accepted'], false);
          return args;
        });
      }
    }.bind(this));
  };

};

ProseEditor.extend(Editor);

module.exports = Editor;
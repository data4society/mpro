'use strict';

var Toolbar = require('substance/ui/Toolbar');
var ToolGroup = require('substance/ui/ToolGroup');

function EditorToolbar() {
  EditorToolbar.super.apply(this, arguments);
}

EditorToolbar.Prototype = function() {

  this.render = function($$) {
    var el = $$("div").addClass(this.getClassNames());
    var commandStates = this.props.commandStates;
    var toolRegistry = this.context.toolRegistry;
    var tools = [];
    toolRegistry.forEach(function(tool, name) {
      if (!tool.options.overlay && tool.options.editor) {
        tools.push(
          $$(tool.Class, commandStates[name])
        );
      }
    });
    el.append(
      $$(ToolGroup).append(tools)
    );
    return el;
  };

  this.getClassNames = function() {
    return 'sc-editor-toolbar';
  };

};

Toolbar.extend(EditorToolbar);

module.exports = EditorToolbar;
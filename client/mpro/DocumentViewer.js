'use strict';

var Controller = require('substance/ui/Controller');
var ContainerEditor = require('substance/ui/ContainerEditor');
var Cover = require('../shared/Cover');

function DocumentViewer() {
  Controller.apply(this, arguments);
}

DocumentViewer.Prototype = function() {

  // Custom Render method for your editor
  this.render = function($$) {
    var config = this.getConfig();
    return $$('div').addClass('sc-document-viewer sc-scroll-pane').append(
      $$('div').addClass('se-document-content se-scrollable').append(
        $$(Cover, {
          doc: this.doc,
          mobile: this.props.mobile,
          editing: 'readonly',
          documentInfo: this.props.documentInfo,
          rubrics: this.props.rubrics
        }).ref('cover'),
        $$(ContainerEditor, {
          doc: this.props.documentSession.doc,
          containerId: 'body',
          name: 'bodyEditor',
          editing: 'selection',
          commands: config.bodyEditor.commands,
          textTypes: config.bodyEditor.textTypes
        }).ref('bodyEditor')
      )
    );
  };
};

Controller.extend(DocumentViewer);

DocumentViewer.static.config = {
  i18n: {
  },
  // Controller specific configuration (required!)
  controller: {
    // Component registry
    components: {
      'paragraph': require('substance/packages/paragraph/ParagraphComponent'),
      'heading': require('substance/packages/heading/HeadingComponent'),
      'image': require('substance/packages/image/ImageComponent'),
      'link': require('substance/packages/link/LinkComponent'),
      'blockquote': require('substance/packages/blockquote/BlockquoteComponent')
    },
    // Controller commands
    commands: [
      require('substance/ui/UndoCommand'),
      require('substance/ui/RedoCommand'),
      require('substance/ui/SaveCommand')
    ]
  },
  titleEditor: {
    commands: [
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/subscript/SubscriptCommand'),
      require('substance/packages/superscript/SuperscriptCommand')
    ]
  },
  // Custom configuration (required!)
  bodyEditor: {
    commands: [
      require('substance/packages/text/SwitchTextTypeCommand'),
      require('substance/packages/strong/StrongCommand'),
      require('substance/packages/emphasis/EmphasisCommand'),
      require('substance/packages/link/LinkCommand'),
      require('substance/packages/image/ImageCommand'),
    ],
    textTypes: [
      {name: 'paragraph', data: {type: 'paragraph'}},
      {name: 'heading1',  data: {type: 'heading', level: 1}},
      {name: 'heading2',  data: {type: 'heading', level: 2}},
      {name: 'heading3',  data: {type: 'heading', level: 3}},
      {name: 'blockquote', data: {type: 'blockquote'}}
    ]
  }
};

module.exports = DocumentViewer;
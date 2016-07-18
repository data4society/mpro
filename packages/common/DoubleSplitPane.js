'use strict';

var Component = require('substance/ui/Component');

/**
  A split view layout component. Takes properties for configuration and 3 children via append.
  @class DoubleSplitPane
  @component
  @prop {String} splitType either 'vertical' (default) or 'horizontal'.
  @prop {String} sizeA size of the first pane (A). '40%' or '100px' or 'inherit' are valid values.
  @prop {String} sizeB size of second pane.
  @prop {String} sizeC size of third pane.
  @example
  ```js
  $$(DoubleSplitPane, {
    sizeA: '30%',
    splitType: 'horizontal'
  }).append(
    $$('div').append('Pane A'),
    $$('div').append('Pane B'),
    $$('div').append('Pane C')
  )
  ```
*/

function DoubleSplitPane() {
  Component.apply(this, arguments);
}

DoubleSplitPane.Prototype = function() {

  this.render = function($$) {
    if (this.props.children.length !== 3) {
      throw new Error('DoubleSplitPane only works with exactly three child elements');
    }

    var el = $$('div').addClass('sc-split-pane');
    if (this.props.splitType === 'horizontal') {
      el.addClass('sm-horizontal');
    } else {
      el.addClass('sm-vertical');
    }

    var paneA = this.props.children[0];
    var paneB = this.props.children[1];
    var paneC = this.props.children[2];

    // Apply configured size to two of third panes.
    if (this.props.sizeA && this.props.sizeB) {
      paneA.addClass('se-pane sm-sized');
      paneA.css(this.getSizedStyle(this.props.sizeA));
      paneB.addClass('se-pane sm-sized');
      paneB.css(this.getSizedStyle(this.props.sizeB));
      paneC.addClass('se-pane sm-auto-fill');
    } else {
      paneA.addClass('se-pane sm-auto-fill');
      paneB.addClass('se-pane sm-sized');
      paneB.css(this.getSizedStyle(this.props.sizeB));
      paneC.addClass('se-pane sm-sized');
      paneC.css(this.getSizedStyle(this.props.sizeC));
    }

    el.append(
      paneA,
      paneB,
      paneC
    );
    return el;
  };

  // Accepts % and px units for size property
  this.getSizedStyle = function(size) {
    if (!size || size === 'inherit') return {};
    if (this.props.splitType === 'horizontal') {
      return {'height': size};
    } else {
      return {'width': size};
    }
  };

};

Component.extend(DoubleSplitPane);

module.exports = DoubleSplitPane;
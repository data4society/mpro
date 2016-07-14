'use strict';

var ScrollPane = require('substance/ui/ScrollPane');

function ListScrollPane() {
  ScrollPane.apply(this, arguments);
}

ListScrollPane.Prototype = function() {
  this.didMount = function() {
    if (this.props.highlights) {
      this.props.highlights.on('highlights:updated', this.onHighlightsUpdated, this);
    }
    // HACK: Scrollbar should use DOMMutationObserver instead
    if (this.refs.scrollbar) {
      //this.context.list.on('list:changed', this.onListChange, this, { priority: -1 });
    }

    this.handleActions({
      'updateOverlayHints': this._updateOverlayHints
    });
  };

  this.dispose = function() {
    if (this.props.highlights) {
      this.props.highlights.off(this);
    }
  };

  // HACK: Scrollbar should use DOMMutationObserver instead
  this.onListChange = function() {
    this.refs.scrollbar.updatePositions();
  };
};

ScrollPane.extend(ListScrollPane);

module.exports = ListScrollPane;
import ScrollPane from 'substance'

class ListScrollPane extends ScrollPane {

  didMount() {
    if (this.props.highlights) {
      this.props.highlights.on('highlights:updated', this.onHighlightsUpdated, this)
    }
    // HACK: Scrollbar should use DOMMutationObserver instead
    if (this.refs.scrollbar) {
      //this.context.list.on('list:changed', this.onListChange, this, { priority: -1 });
    }

    this.handleActions({
      'updateOverlayHints': this._updateOverlayHints
    })
  }

  dispose() {
    if (this.props.highlights) {
      this.props.highlights.off(this)
    }
  }

  // HACK: Scrollbar should use DOMMutationObserver instead
  onListChange() {
    this.refs.scrollbar.updatePositions()
  }
}

export default ListScrollPane

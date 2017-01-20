import { Button, Component } from 'substance'
import isEmpty from 'lodash/isEmpty'

/*
  Incoming Documents Feed.

  Component represents list of incoming documents.
*/
class Feed extends Component {

  shouldRerender(props) {
    let documentId = this.props.documentId
    if(props.documentId !== documentId && !isEmpty(props.documentId)) {
      return false
    }
    return true
  }

  render($$) {
    if(!this.activeItem && this.props.documentId) {
      this.activeItem = this.props.documentId
    }

    let Pager = this.getComponent('pager')

    let documentItems = this.props.documentItems
    let el = $$('div').addClass('sc-feed')

    if (!documentItems) {
      return el
    }

    el.append(this.renderIntro($$))

    if (documentItems.length > 0) {
      el.append(
        this.renderFull($$),
        $$(Pager, {
          total: this.props.totalItems,
          loaded: this.props.documentItems.length
        })
      )
    } else {
      el.append(this.renderEmpty($$))
    }
    return el
  }

  /*
    Intro.

    Contains counter of found documents.
  */
  renderIntro($$) {
    let totalItems = this.props.totalItems
    let el = $$('div').addClass('se-intro')
    let label = this.getLabel('counter' + this._getNumEnding(totalItems))
    label = totalItems > 0 ? totalItems + ' ' + label : label

    el.append(
      $$('div').addClass('se-document-count').append(
        label
      )
    )

    if(this.props.addNew) {
      el.append(
        $$(Button, {label: 'new-document', style: 'default'}).addClass('se-new-document-button')
          .on('click', this.send.bind(this, 'newDocument'))
      )
    }

    if(this.props.modes) {
      let plainModeBtn = $$(Button, {style: 'default', icon: 'plain-mode'}).addClass('se-plain-mode')
        .on('click', this.send.bind(this, 'switchMode', 'plain'))
      let themedModeBtn = $$(Button, {style: 'default', icon: 'themed-mode'}).addClass('se-themed-mode')
        .on('click', this.send.bind(this, 'switchMode', 'themed'))

      if(this.props.mode === 'themed') {
        themedModeBtn.addClass('sm-active')
      } else {
        plainModeBtn.addClass('sm-active')
      }

      el.append(
        $$('div').addClass('se-modes').append(
          plainModeBtn,
          themedModeBtn
        )
      )
    }

    return el
  }

  /*
    Empty feed.

    Contains legend for empty list.
  */
  renderEmpty($$) {
    let el = $$('div').addClass('se-feed-empty')

    el.append(
      $$('p').append(this.getLabel('empty-feed'))
    )

    return el
  }

  /*
    Non-empty feed.

    Contains Feed Items.
  */
  renderFull($$) {
    let documentItems = this.props.documentItems;
    let el = $$('div').addClass('se-feed-not-empty');

    if (documentItems) {
      documentItems.forEach(function(documentItem) {
        let schemaName = documentItem.schemaName
        let FeedItem = this.getComponent(schemaName + '-feed-item')
        let FeedThemedItem = this.getComponent('feed-themed-item')
        let active = false
        if(documentItem.documentId === this.activeItem) {
          active = true
        }
        let itemComp = this.props.mode === 'themed' && documentItem.count > 1 ? FeedThemedItem : FeedItem

        el.append(
          $$(itemComp, {
            document: documentItem,
            active: active,
            rubrics: this.props.rubrics
          }).ref(documentItem.documentId)
        )
      }.bind(this))
    }
    return el
  }

  setActiveItem(documentId) {
    let currentActive = this.activeItem

    if(currentActive && !isEmpty(this.refs)) {
      if(this.refs[currentActive]) {
        this.refs[currentActive].extendProps({
          update: true,
          active: false
        })
      }
    }

    if(this.refs[documentId]) {
      this.refs[documentId].extendProps({
        update: true,
        active: true
      })
    }

    this.activeItem = documentId
  }

  updateRubrics(documentId, rubrics) {
    if(this.refs[documentId]) {
      let document = this.refs[documentId].props.document
      document.meta.rubrics = rubrics
      this.refs[documentId].extendProps({
        update: true,
        document: document
      })
    }
  }

  /*
    Return specific number of word ending set.
    - 0 is for 0 items
    - 1 is for 1 item
    - 4 is for 4 items
    - 5 is for 5 items
  */
  _getNumEnding(number) {
    number = parseInt(number, 10)
    let endingSet, i
    if(number === 0) return 0
    number = number % 100
    if (number>=11 && number<=19) {
      endingSet = 5
    }
    else {
      i = number % 10
      switch (i) {
        case (1): endingSet = 1
          break;
        case (2):
        case (3):
        case (4): endingSet = 4
          break;
        default: endingSet = 5
      }
    }
    return endingSet
  }

}

export default Feed

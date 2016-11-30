import { Component, Grid, Layout, SplitPane, request } from 'substance'
import each from 'lodash/each'

class OIDigest extends Component {
  constructor(...args) {
    super(...args)

    // this.handleActions({
    //   'loadMore': this._loadMore
    // })
  }

  didMount() {
    this._loadCollections()
  }

  willReceiveProps() {
  }

  getInitialState() {
    return {
      endpoint: 'https://mpro.d4s.io',
      collectionsKey: 'ed685693-c93a-3ee3-9879-2c5e906d920a',
      collections: []
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-digest sc-container')
    
    let layout = $$(Layout, {
      width: 'large',
      textAlign: 'left',
      noPadding: false
    })

    layout.append(
      $$(SplitPane, {
        sizeA: '300px',
        splitType: 'vertical'
      }).append(
        $$('div').append('Pane A'),
        $$('div').append('Pane B')
      ).addClass('se-digest')
    )

    el.append(layout)

    return el
  }

  renderSideBar($$) {
    let el = $$('div').addClass('sc-collections')
    let collections = this.state.collections
    
    each(collections, function(collection) {
      let item = $$('div').addClass('se-collection-node').append(
        $$('span').addClass('se-node-name').append(collection.name),
        $$('span').addClass('se-node-count').append(collection.count)
      ).ref(collection.collection)

      el.append(item)
    })

    return el
  }

  renderContent($$) {
    return $$('div').append('Pane B')
  }

  _loadCollections() {
    let url = this.state.endpoint + '/api/public/' + this.state.collectionsKey
    request('GET', url, null, function(err, collections) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      this.extendState({collections: collections})
    }.bind(this))
  }

}

export default OIDigest

import { Component, Grid, request } from 'substance'
import concat from 'lodash/concat'
import moment from 'moment'
import Pager from './Pager'

class Feed extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore
    })
  }

  didMount() {
    this._loadData()
  }

  willReceiveProps() {
  }

  getInitialState() {
    return {
      items: [],
      perPage: 5,
      page: 1,
      pagination: false
    }
  }

  render($$) {
    let items = this.state.items
    let el = $$('div').addClass('sc-embed')

    if (!items) {
      return el
    }

    if (items.length > 0) {
      el.append(this.renderFull($$))
    } else {
      el.append(this.renderEmpty($$))
    }

    return el
  }

  renderEmpty($$) {
    let el = $$('div').addClass('se-list-empty')

    el.append(
      $$('h1').html(
        'Нет документов'
      ),
      $$('p').html('К сожалению по вашему запросу мы ничего не нашли')
    )

    return el
  }

  renderFull($$) {
    let items = this.state.items
    let total = this.state.total
    let el = $$('div').addClass('se-list-not-empty')
    let grid = $$(Grid)

    if (items) {
      items.forEach(function(item) {
        let published = moment(item.meta.published).format('DD.MM.YYYY')
        let sourceName = this._getSourceName(item.meta.source)
        grid.append(
          $$('a').attr({href: item.meta.source, target: '_blank', class: 'se-row se-source'}).ref(item.doc_id).append(
            $$(Grid.Cell, {columns: 6}).append(sourceName),
            $$(Grid.Cell, {columns: 6}).addClass('se-item-published').append(published),
            $$('div').addClass('se-divider'),
            $$(Grid.Row).addClass('se-item-title').append(item.meta.title),
            $$(Grid.Row).addClass('se-item-abstract').append(item.meta.abstract)
          )
        )
      }.bind(this))

      el.append(grid)
      if(items.length < total) {
        el.append($$(Pager, {total: total, loaded: items.length}))
      }
    }
    return el
  }

  _getSourceName(url) {
    let re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
    let res = re.exec(url)
    if(res) {
      return res[1]
    } else {
      return ''
    }
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadData()
  }

  /*
    Loads donations
  */
  _loadData() {
    let perPage = this.state.perPage
    
    let options = {
      limit: perPage, 
      offset: this.state.items.length
    }
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    let url = window.location.href + '&options=' + optionsRequest + '&format=json'
    request('GET', url, null, function(err, results) {
      if (err) {
        console.error('ERROR', err)
        return
      }
      let items
      if(this.state.pagination) {
        items = concat(this.state.items, results.records)
      } else {
        items = results.records
      }

      this.extendState({
        items: items,
        total: results.total
      })
    }.bind(this))  
  }
}

export default Feed

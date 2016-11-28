import { Component, Button, Grid, Modal, SubstanceError as Err } from 'substance'
import clone from 'lodash/clone'
import concat from 'lodash/concat'
import extend from 'lodash/extend'
import findIndex from 'lodash/findIndex'
import ApiForm from './ApiForm'

class ApisList extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore,
      'closeModal': this._hideApiDialog
    })
  }

  didMount() {
    this._loadApis()
  }

  getInitialState() {
    return {
      filters: {app_id: this.props.app},
      active: '',
      search: null,
      dialog: false,
      perPage: 30,
      page: 1,
      order: 'key',
      direction: 'desc',
      items: []
    }
  }

  render($$) {
    let items = this.state.items
    let el = $$('div').addClass('sc-list')

    if (!items) {
      return el
    }

    el.append(this.renderIntro($$))

    if (items.length > 0) {
      el.append(this.renderFull($$))
    } else {
      el.append(this.renderEmpty($$))
    }
    return el
  }

  renderIntro($$) {
    let totalItems = this.state.totalItems
    let el = $$('div').addClass('se-intro no-filters')

    el.append(
      $$('div').addClass('se-items-count').append(
        $$('strong').append(totalItems),
        ' public APIs found'
      ),
      $$(Button).addClass('se-add-api')
        .on('click', this._showApiDialog)
        .append('Add public API')
    )

    if (this.state.dialog) {
      let activeKey = this.state.active
      let activeIndex = findIndex(this.state.items, function(item) {
        return item.key === activeKey
      })
      el.append(
        $$(Modal, {
          width: 'middle'
        }).addClass('se-api-form-modal').append(
          $$(ApiForm, extend({}, {currentApp: this.props.app}, this.state.items[activeIndex])).ref('api-form')
        )
      )
    }

    return el
  }

  renderEmpty($$) {
    let el = $$('div').addClass('se-list-empty')

    el.append(
      $$('h1').html(
        'No results'
      ),
      $$('p').html('There are no APIs for this app')
    )

    return el
  }

  renderFull($$) {
    let items = this.state.items
    let total = this.state.totalItems
    let Pager = this.getComponent('pager')
    let el = $$('div').addClass('se-list-not-empty')

    let grid = $$(Grid)

    if (items) {
      items.forEach(function(item) {        
        let switchAttrs = {type: 'checkbox', class: 'se-switch-checkbox', id: 'live-' + item.key}
        if(item.live) switchAttrs.checked = 'checked'

        let liveSwitcher = $$('div').addClass('se-switch').append(
          $$('input').attr(switchAttrs),
          $$('label').attr({class: 'se-switch-label', for: 'live-' + item.key}).append(
            $$('span').addClass('se-switch-inner'),
            $$('span').addClass('se-switch-switch')
          )
        )
        
        let row = $$(Grid.Row, {api: item}).ref(item.key).append(
          $$(Grid.Cell, {columns: 3}).append(item.key),
          $$(Grid.Cell, {columns: 2}).append(item.api)
            .on('click', this._showApiDialog.bind(this, item.key)),
          $$(Grid.Cell, {columns: 3}).append(item.param)
            .on('click', this._showApiDialog.bind(this, item.key)),
          $$(Grid.Cell, {columns: 2}).append(item.format)
            .on('click', this._showApiDialog.bind(this, item.key)),
          $$(Grid.Cell, {columns: 2}).addClass('se-cell-switcher')
            .append(liveSwitcher)
            .on('click', this._switchLive.bind(this, item))
        )

        if(item.live) {
          let segment = ''

          if(item.api === 'get_document') {
            segment = '/?query=documentId'
          } else if (item.api === 'entities_list') {
            segment = '/?query=[colId1,...,colIdN]&options={"limit":10,"offset":0}'
          } else if (item.api === 'collections_list') {
            segment = '/?query=[colId1,...,colIdN]&options={"limit":10,"offset":0}'
          } else if (item.api === 'entity_docs') {
            segment = '/?query=personName&options={"limit":10,"offset":0}'
          } else if (item.api === 'collection_docs') {
            segment = '/?query=collectionId&options={"limit":10,"offset":0}'
          }

          let config = this.context.config
          let url = config.protocol + '://' + config.host + '/api/public/' + item.key + segment
          row.append(
            $$(Grid.Row).addClass('se-row-endpoint').append('API endpoint: ' + url)
          )
        }
        grid.append(row)
      }.bind(this))

      el.append(
        grid,
        $$(Pager, {total: total, loaded: items.length})
      )
    }
    return el
  }

  _showApiDialog(key) {
    this.extendState({'dialog': true, 'active': key})
  }

  _hideApiDialog() {
    let apiRecord = this.refs['api-form'].state.record
    if(apiRecord.key) {
      this._updateApi(apiRecord, this.state.active)
      this.extendState({'dialog': false, active: ''})
    } else {
      this._createApi(apiRecord)
    }
  }

  _switchLive(item) {
    let update = clone(item)
    update.live = !item.live
    this._updateApi(update, update.key)
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadApis()
  }

  _updateApi(data, key) {
    let documentClient = this.context.documentClient
    documentClient.updateApi(data.key, data, function(err) {
      if (err) {
        this.setState({
          error: new Err('ApiList.UpdateError', {
            message: 'API could not be updated.',
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }

      if(key) {
        let activeIndex = findIndex(this.state.items, function(item) {
          return item.key === key
        })
        let items = this.state.items
        items[activeIndex] = data

        this.extendState({items: items})
      }
    }.bind(this))
  }

  _createApi(data) {
    let documentClient = this.context.documentClient
    documentClient.createApi(data, function(err, api) {
      if (err) {
        this.setState({
          error: new Err('ApiList.CreateError', {
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }
      let apis = this.state.items
      apis.unshift(api)
      this.extendState({items: apis, 'dialog': false})
    }.bind(this))
  }

  /*
    Loads apis
  */
  _loadApis() {
    let self = this
    let documentClient = this.context.documentClient
    let filters = this.state.filters
    let perPage = this.state.perPage
    let page = this.state.page
    let pagination = this.state.pagination
    let order = this.state.order
    let direction = this.state.direction
    let items = []

    documentClient.listApis(filters,
      {
        limit: perPage, 
        offset: this.state.items.length,
        order: order + ' ' + direction
      }, function(err, results) {
        if (err) {
          this.setState({
            error: new Err('ApiList.LoadingError', {
              message: 'Public APIs could not be loaded.',
              cause: err
            })
          });
          console.error('ERROR', err)
          return
        }

        if(pagination) {
          items = concat(this.state.items, results.records)
        } else {
          items = results.records
        }

        self.extendState({
          items: items,
          totalItems: results.total
        });
      }.bind(this))
  }
}

export default ApisList

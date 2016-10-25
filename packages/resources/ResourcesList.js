import { Component, Button, Grid, Modal, SubstanceError as Err } from 'substance'
import concat from 'lodash/concat'
import moment from 'moment'

class ResourcesList extends Component {
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
    this._loadData()
  }

  getInitialState() {
    return {
      filters: {},
      search: null,
      dialog: false,
      perPage: 30,
      page: 1,
      order: 'created',
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
        ' items found'
      )
    )

    return el
  }

  renderEmpty($$) {
    let el = $$('div').addClass('se-list-empty')

    el.append(
      $$('h1').html(
        'No results'
      ),
      $$('p').html('We have no data matching your query')
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
        let created = moment(item.created).format("DD.MM.YYYY HH:mm")
        let edited = moment(item.edited).format("DD.MM.YYYY HH:mm")
        
        grid.append(
          $$(Grid.Row, {entity: item}).ref(item.entity_id).append(
            $$(Grid.Cell, {columns: 2}).append('#'+item.entity_id),
            $$(Grid.Cell, {columns: 2}).append(item.name),
            $$(Grid.Cell, {columns: 2}).append(item.entity_class),
            $$(Grid.Cell, {columns: 2}).append(created),
            $$(Grid.Cell, {columns: 2}).append(edited),
            $$(Grid.Cell, {columns: 2}).append(item.author)
          ).ref(item.entity_id)
        )
      })

      el.append(
        grid,
        $$(Pager, {total: total, loaded: items.length})
      )
    }
    return el
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadUsers()
  }

  /*
    Loads entities
  */
  _loadData() {
    let self = this
    let documentClient = this.context.documentClient
    let filters = this.state.filters
    let perPage = this.state.perPage
    let page = this.state.page
    let pagination = this.state.pagination
    let order = this.state.order
    let direction = this.state.direction
    let items= []
    //var userId = this._getUserId();

    documentClient.listEntities(filters,
      {
        limit: perPage, 
        offset: this.state.items.length,
        order: order + ' ' + direction
      }, function(err, results) {
        if (err) {
          this.setState({
            error: new Err('EntityList.LoadingError', {
              message: 'Data could not be loaded.',
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

export default ResourcesList

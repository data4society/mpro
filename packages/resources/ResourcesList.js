import { Component, Button, Grid, Modal, SubstanceError as Err } from 'substance'
import concat from 'lodash/concat'
import each from 'lodash/each'
import extend from 'lodash/extend'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'
import Filters from './Filters'

class ResourcesList extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'filterList': this._filterList,
      'changePage': this._changePage
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

    el.append($$(Filters, this.state.filters).ref('filters'))

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

  _changePage(page) {
    this.extendState({
      page: page
    })
    this._loadData()
  }

  _filterList(property, value) {
    let state = this.getState()
    let filters = state.filters
    let updatedFilters = {}
    updatedFilters[property] = value
    updatedFilters = extend({}, filters, updatedFilters)

    this.extendState({
      filters: updatedFilters
    })
    this._loadData()
  }

  _prepareFilters() {
    let filters = this.state.filters
    let query = {}
    each(filters, function(filter) {
      let name = filter.name
      let op = filter.op
      let value = filter.value
      if(name && !isEmpty(value)) {
        // props with @ means same prop, but different queries
        // for example we need to filter by sum using
        // gte and lte quieries 
        if(name.split('@').length > 0) {
          name = name.split('@')[0]
        }

        // complex or query
        if(filter.multi) {
          query['or'] = []
          each(filter.multi, function(subprop) {
            let subQuery = {}
            let prop = op ? subprop + ' ' + op : subprop
            subQuery[prop] = value
            // Regex ilike
            if(op === '~~*') subQuery[prop] = '%' + value + '%'
            query['or'].push(subQuery)
          })
        } else {
          let prop = op ? name + ' ' + op : name
          query[prop] = value
          // Regex ilike
          if(op === '~~*') query[prop] = '%' + value + '%'
        }
      }
    })

    return query
  }

  /*
    Loads entities
  */
  _loadData() {
    let self = this
    let documentClient = this.context.documentClient
    let filters = this._prepareFilters()
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
        offset: perPage * (page - 1),
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

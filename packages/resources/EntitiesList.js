import { Component, Grid, Modal, SubstanceError as Err } from 'substance'
import concat from 'lodash/concat'
import each from 'lodash/each'
import extend from 'lodash/extend'
import isEmpty from 'lodash/isEmpty'
import Filters from './Filters'

class EntitiesList extends Component {
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
      edit: false,
      active: {},
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
    let el = $$('div').addClass('se-intro')

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
    let urlHelper = this.context.urlHelper
    let items = this.state.items
    let total = this.state.totalItems
    let page = this.state.page
    let perPage = this.state.perPage
    let EntityEditor = this.getComponent('entity-editor')
    let Pager = this.getComponent('simple-pager')
    let el = $$('div').addClass('se-list-not-empty')
    let grid = $$(Grid)
    
    if (items) {
      items.forEach(item => {
        let url = urlHelper.filterDocuments(item.entity_id, this.props.app)

        grid.append(
          $$('a').addClass('se-row').append(
            $$(Grid.Cell, {columns: 6}).append(item.name),
            $$(Grid.Cell, {columns: 5}).append(item.entity_class),
            $$(Grid.Cell, {columns: 1}).append(item.count)
          ).attr({href: url}).ref(item.entity_id)
        )
      })

      if (this.state.edit) {
        let node = this.state.active
        el.append(
          $$(Modal, {
            width: 'medium'
          }).append(
            $$(EntityEditor, {entityId: node.entity_id, node: {'entityClass': node.entity_class}})
          )
        )
      }

      el.append(
        grid,
        $$(Pager, {total: total, page: page, perPage: perPage})
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
    let items = []
    //var userId = this._getUserId();

    documentClient.listEntities(filters,
      {
        limit: perPage, 
        offset: perPage * (page - 1),
        order: order + ' ' + direction,
        columns: [
          'entity_id',
          'name',
          'created',
          'edited',
          'author',
          'entity_class',
          'labels',
          'external_data',
          "(SELECT COUNT(*) from records WHERE records.entities @> ARRAY[\"entity_id\"::varchar] AND app_id = '" + this.props.app + "') AS count"
        ]
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

export default EntitiesList

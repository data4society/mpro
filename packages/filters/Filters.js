import { Component } from 'substance'

class Filters extends Component {

  render($$) {
    let filters = this.props.filters
    let Facets = this.getComponent('facets')
    let FtsFilter = this.getComponent('fts-filter')

    let el = $$('div').addClass('sc-filters')

    el.append(
      $$(FtsFilter, {value: filters.fts})
    )

    if(this.props.acceptor) {
      let AcceptorFilter = this.getComponent('acceptor-filter')
      el.append(
        $$(AcceptorFilter, {
          accepted: filters['accepted'],
          moderated: filters['meta->>moderated'],
          negative: filters['negative']
        })
      )
    }

    if(this.props.entities) {
      let EntityFacets = this.getComponent('entity-facets')
      el.append(
        $$(EntityFacets, {entities: this.props.entities})
      )
    }

    el.append(
      $$(Facets, this.props)
    )

    return el
  }
}

export default Filters

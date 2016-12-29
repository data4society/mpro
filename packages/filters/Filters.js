import { Component } from 'substance'

class Filters extends Component {

  render($$) {
    let filters = this.props.filters
    let Facets = this.getComponent('facets')
    
    let el = $$('div').addClass('sc-filters')
    // console.log(config)
    if(this.props.acceptor) {
      let AcceptorFilter = this.getComponent('acceptor-filter')
      el.append(
        $$(AcceptorFilter, {
          accepted: filters['meta->>accepted'],
          moderated: filters['meta->>moderated']
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

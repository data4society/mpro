import { Component } from 'substance'

class Filters extends Component {

  render($$) {
    let Facets = this.getComponent('facets')

    let el = $$('div').addClass('sc-filters')

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

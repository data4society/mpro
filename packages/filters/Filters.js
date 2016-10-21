import { Component } from 'substance'

class Filters extends Component {

  render($$) {
    let Facets = this.getComponent('facets')

    let el = $$('div').addClass('sc-filters')

    el.append(
      $$(Facets, this.props)
    )

    return el
  }
}

export default Filters

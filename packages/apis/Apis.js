import { Component, Layout } from 'substance'
import ApisList from './ApisList'

class Apis extends Component {

  render($$) {
    let el = $$('div').addClass('sc-apis sc-container')

    let header = this.renderHeader($$)
    el.append(header)
    
    let layout = $$(Layout, {
      width: 'full',
      textAlign: 'left',
      noPadding: true
    })

    layout.append(
      $$(ApisList, this.props).ref('list')
    )

    el.append(layout)

    return el
  }

  renderHeader($$) {
    let Header = this.getComponent('header')
    let header = $$(Header, this.props)

    return header
  }
}

export default Apis
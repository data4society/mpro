import { Component, Layout } from 'substance'
import ResourcesList from './ResourcesList'

class Resources extends Component {

  render($$) {
    let el = $$('div').addClass('sc-resources sc-container')

    let header = this.renderHeader($$)
    el.append(header)
    
    let layout = $$(Layout, {
      width: 'full',
      textAlign: 'left',
      noPadding: true
    })

    layout.append(
      $$(ResourcesList, this.props).ref('list')
    )

    el.append(layout)

    return el
  }

  renderHeader($$) {
    let Header = this.getComponent('header')
    let header = $$(Header)

    return header
  }
}

export default Resources
import { Component, Layout } from 'substance'
import UsersList from './UsersList'

class Users extends Component {

  render($$) {
    let el = $$('div').addClass('sc-users sc-container')

    let header = this.renderHeader($$)
    el.append(header)
    
    let layout = $$(Layout, {
      width: 'full',
      textAlign: 'left',
      noPadding: true
    })

    layout.append(
      $$(UsersList, this.props).ref('list')
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

export default Users
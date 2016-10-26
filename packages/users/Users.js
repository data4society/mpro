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
    let header = $$(Header, {
      actions: {
        'inbox': this.getLabel('inbox-menu'),
        'configurator': this.getLabel('configurator-menu'),
        'import': this.getLabel('import-menu'),
        'resources': this.getLabel('configurator-resources'),
        'users': this.getLabel('configurator-users')
      }
    })

    return header
  }
}

export default Users
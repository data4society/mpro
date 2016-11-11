import { Component } from 'substance'
import LoginStatus from './LoginStatus'
import each from 'lodash/each'

class Header extends Component {

  render($$) {
    let authenticationClient = this.context.authenticationClient
    let el = $$('div').addClass('sc-header')
    let actionEls = []

    let actions = {
      'inbox': this.getLabel('inbox-menu'),
      'collections': this.getLabel('collections-menu'),
      'configurator': this.getLabel('configurator-menu'),
      'import': this.getLabel('import-menu'),
      'resources': this.getLabel('configurator-resources'),
      'users': this.getLabel('configurator-users')
    }

    each(actions, function(label, actionName) {
      actionEls.push(
        $$('button').addClass('se-action')
          .append(label)
          .on('click', this.send.bind(this, actionName))
      )
    }.bind(this))

    let content = []
    if (this.props.content) {
      content = content.concat(this.props.content)
    }

    el.append(
      $$('div').addClass('se-actions').append(actionEls),
      $$(LoginStatus, {
        user: authenticationClient.getUser()
      }),
      $$('div').addClass('se-content').append(content)
    )
    return el
  }
}

export default Header

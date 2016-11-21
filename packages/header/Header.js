import { Component } from 'substance'
import LoginStatus from './LoginStatus'
import each from 'lodash/each'
import find from 'lodash/find'

class Header extends Component {

  render($$) {
    let authenticationClient = this.context.authenticationClient
    let el = $$('div').addClass('sc-header')

    el.append(this.renderAppSelector($$))

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

  renderAppSelector($$) {
    let appsConfig = this.context.config.apps
    let currentAppConfig = find(appsConfig, function(app) {
      return this.props.app === app.appId
    }.bind(this))

    let el = $$('div').addClass('se-app-selector')

    el.append($$('input').attr({class: 'se-app-selector-toggle', type: 'text'}))
    let currentValue = $$('div').addClass('se-app-selector-text').append(
      this.context.iconProvider.renderIcon($$, 'header-app'),
      $$('div').addClass('se-selected-app-name').append(currentAppConfig.name)
    )
    let list = $$('ul').addClass('se-app-selector-content')
    each(appsConfig, function(app) {
      list.append(
        $$('li').append($$('a').attr({href: '#'}).append(app.name))
          .on('click', this._onAppSwitch.bind(this, app.appId))
      )
    }.bind(this))
    el.append(
      currentValue,
      list
    )

    return el
  }

  _onAppSwitch(appId) {
    this.send('switchApp', appId)
  }
}

export default Header

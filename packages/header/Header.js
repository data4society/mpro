import { Component } from 'substance'
import LoginStatus from './LoginStatus'
import each from 'lodash/each'

class Header extends Component {

  render($$) {
    let appsConfig = this.context.config.apps
    let currentAppConfig = appsConfig[this.props.app]
    let authenticationClient = this.context.authenticationClient
    let user = authenticationClient.getUser()
    let el = $$('div').addClass('sc-header')

    el.append(this.renderAppSelector($$))

    let actionEls = []

    let actions = {}

    if(currentAppConfig.configurator) {
      actions.configurator = this.getLabel('configurator-menu')
      actions.import = this.getLabel('import-menu')
      actions.users = this.getLabel('configurator-users')
    } else {
      actions.inbox = this.getLabel('inbox-menu')

      if(currentAppConfig.rubrics && currentAppConfig.entities && user.super) {
        actions.collections = this.getLabel('collections-menu')
      }
      if(currentAppConfig.entities) {
        if(user.super) {
          actions.resources = this.getLabel('configurator-resources')
        }
        actions.entities = this.getLabel('entities-menu')
      }

      actions.rubrics = this.getLabel('rubrics-menu')

      if(user.super) {
        actions.apis = this.getLabel('api-menu')
        actions.users = this.getLabel('configurator-users')
      }
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
        user: user
      }),
      $$('div').addClass('se-content').append(content)
    )
    return el
  }

  renderAppSelector($$) {
    let appsConfig = this.context.config.apps
    let currentAppConfig = appsConfig[this.props.app]

    let el = $$('div').addClass('se-app-selector')

    el.append($$('input').attr({class: 'se-app-selector-toggle', type: 'text'}))
    let currentValue = $$('div').addClass('se-app-selector-text').append(
      this.context.iconProvider.renderIcon($$, 'header-app'),
      $$('div').addClass('se-selected-app-name').append(currentAppConfig.name)
    )
    let list = $$('ul').addClass('se-app-selector-content')
    each(appsConfig, function(app) {
      list.append(
        $$('li').append($$('span').append(app.name))
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

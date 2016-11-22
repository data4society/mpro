import AbstractApplication from '../common/AbstractApplication'
import MproRouter from './MproRouter'
import extend from 'lodash/extend'
import find from 'lodash/find'
import forEach from 'lodash/forEach'

/*
  Mpro Application component.
*/
class Mpro extends AbstractApplication {
  constructor(...args) {
    super(...args)
  
    let configurator = this.props.configurator

    this.config = configurator.getAppConfig()
    this.configurator = configurator
    this.authenticationClient = configurator.getAuthenticationClient()
    this.documentClient = configurator.getDocumentClient(this.authenticationClient)
    this.fileClient = configurator.getFileClient(this.authenticationClient)
    this.componentRegistry = configurator.getComponentRegistry()
    this.iconProvider = configurator.getIconProvider()
    this.labelProvider = configurator.getLabelProvider()

    let pages = this.configurator.getPages()
    forEach(pages, function(page) {
      this.addPage(page, this.componentRegistry.get(page))
    }.bind(this))

    this._loadAppsConfig()

    this.handleActions({
      'switchApp': this._switchApp,
      'users': this._users,
      'resources': this._resources,
      'configurator': this._configurator,
      'collections': this._collections,
      'inbox': this._inbox,
      'home': this._home
    })
  }

  getChildContext() {
    return {
      config: this.config,
      configurator: this.configurator,
      authenticationClient: this.authenticationClient,
      documentClient: this.documentClient,
      fileClient: this.fileClient,
      urlHelper: this.router,
      componentRegistry: this.componentRegistry,
      iconProvider: this.iconProvider,
      labelProvider: this.labelProvider
    }
  }

  getDefaultPage() {
    return 'inbox'
  }

  getLoginPage() {
    return 'welcome'
  }

  getRouter() {
    return new MproRouter(this)
  }

  _onAuthentication(route, session) {
    if(!session) {
      route.page = this.getLoginPage()
    } else if (!session.user.name) {
      route.page = 'entername'
    }

    return route
  }

  _switchApp(appId) {
    if(this.config.apps[appId].configurator) {
      this.navigate({
        page: 'configurator',
        app: appId
      }, {replace: true})
    } else {
      this.navigate({
        page: 'inbox',
        app: appId
      }, {replace: true})
    }
  }

  _home() {
    this.navigate({
      page: this.getDefaultPage()
    })
  }

  _users() {
    this.navigate({
      page: 'users'
    })
  }

  _resources() {
    this.navigate({
      page: 'resources'
    })
  }

  _configurator() {
    this.navigate({
      page: 'configurator'
    })
  }

  _collections() {
    this.navigate({
      page: 'collections'
    })
  }

  _inbox() {
    this.navigate({
      page: 'inbox'
    })
  }

  _loadAppsConfig() {
    this.documentClient.getConfig(function(err, config) {
      if(err) {
        console.log(error)
      }
      extend(this.config, {apps: config})
      if(!this.state.appId) {
        let defaultApp = find(this.config.apps, function(app) {
          return app.default
        })

        this.extendState({appId: defaultApp.appId})
      }
    }.bind(this))
  }
}

export default Mpro

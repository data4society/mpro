import AbstractApplication from '../common/AbstractApplication'
import MproRouter from './MproRouter'
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
    this.documentClient = configurator.getDocumentClient()
    this.fileClient = configurator.getFileClient()
    this.componentRegistry = configurator.getComponentRegistry()
    this.iconProvider = configurator.getIconProvider()
    this.labelProvider = configurator.getLabelProvider()

    let pages = this.configurator.getPages()
    forEach(pages, function(page) {
      this.addPage(page, this.componentRegistry.get(page))
    }.bind(this))

    this.handleActions({
      'configurator': this._configurator,
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

  _home() {
    this.navigate({
      page: this.getDefaultPage()
    })
  }

  _configurator() {
    this.navigate({
      page: 'configurator'
    })
  }

  _inbox() {
    this.navigate({
      page: 'inbox'
    })
  }
}

export default Mpro

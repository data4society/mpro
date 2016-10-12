import AbstractApplication from '../common/AbstractApplication'
import MproRouter from './MproRouter'

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

    this.addPage('welcome', this.componentRegistry.get('welcome'))
    this.addPage('inbox', this.componentRegistry.get('inbox'))
    this.addPage('configurator', this.componentRegistry.get('configurator'))

    this.handleActions({
      'configurator': this._configurator,
      'inbox': this._inbox
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
      route.page = 'welcome'
    } 
    // else if (!session.user.name) {
    //   route.page = 'entername';
    // }

    return route
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

import { Configurator } from 'substance'

/*
  Top-level configurator for mpro. Has sub-configurators for
  all available modules (editor, viewer etc).
*/
class MproConfigurator extends Configurator {

  constructor(...args) {
    super(...args)
    // Extend config
    this.config.configurators = {}
    this.config.pages = []
  }


  /*
    Set app config
  */
  setAppConfig(config) {
    this.config.app = config
  }

  /*
    Get app config
  */
  getAppConfig() {
    return this.config.app
  }

  /*
    Set Authentication Server url
  */
  setAuthenticationServerUrl(url) {
    this.config.authenticationServerUrl = url
  }

  /*
    Set Document Server url
  */
  setDocumentServerUrl(url) {
    this.config.documentServerUrl = url
  }

  /*
    Set File Server url
  */
  setFileServerUrl(url) {
    this.config.fileServerUrl = url
  }

  /*
    Set Fastart Server url
  */
  setFastartServerUrl(url) {
    this.config.fastartServerUrl = url
  }

  /*
    Set File Client class
  */
  setFileClient(fileClient) {
    this.config.fileClient = fileClient
  }

  /*
    Set Document Client class
  */
  setDocumentClient(DocumentClientClass) {
    this.config.DocumentClientClass = DocumentClientClass
  }

  /*
    Get Document Client instance
  */
  getDocumentClient(authClient) {
    let DocumentClientClass = this.config.DocumentClientClass
    return new DocumentClientClass({httpUrl: this.config.documentServerUrl, authClient: authClient})
  }

  /*
    Set Authentication Client class
  */
  setAuthenticationClient(AuthenticationClientClass) {
    this.config.AuthenticationClientClass = AuthenticationClientClass
  }

  /*
    Get Authentication Client instance
  */
  getAuthenticationClient() {
    let AuthenticationClientClass = this.config.AuthenticationClientClass
    return new AuthenticationClientClass({httpUrl: this.config.authenticationServerUrl})
  }

  /*
    Get File Client instance
  */
  getFileClient(authClient) {
    let FileClientClass = this.config.fileClient
    return new FileClientClass({httpUrl: this.config.fileServerUrl, authClient: authClient})
  }

  /*
    Set Fastart Client class
  */
  setFastartClient(FastartClientClass) {
    this.config.FastartClientClass = FastartClientClass
  }

  /*
    Get Fastart Client instance
  */
  getFastartClient() {
    let FastartClientClass = this.config.FastartClientClass
    return new FastartClientClass({httpUrl: this.config.fastartServerUrl})
  }

  /*
    Provision of sub configurators (e.g. editor, viewer etc
    receive their own configurator)
  */
  addConfigurator(name, configurator) {
    this.config.configurators[name] = configurator
  }

  /*
    Get sub confgiurator
  */
  getConfigurator(name) {
    if (!this.config.configurators) {
      return undefined
    }
    return this.config.configurators[name]
  }

  addPage(pageName, component) {
    this.addComponent(pageName, component)
    this.config.pages.push(pageName)
  }

  getPages() {
    return this.config.pages
  }
}

export default MproConfigurator

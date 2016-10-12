import Configurator from 'substance'
import each from 'lodash/each'
import uniq from 'lodash/uniq'

/*
  Top-level configurator for mpro. Has sub-configurators for
  all available modules (editor, viewer etc).
*/
class MproConfigurator extends Configurator {
  
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
  getDocumentClient() {
    let DocumentClientClass = this.config.DocumentClientClass
    return new DocumentClientClass({httpUrl: this.config.documentServerUrl})
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
  getFileClient() {
    let FileClientClass = this.config.fileClient
    return new FileClientClass({httpUrl: this.config.fileServerUrl})
  }

  /*
    Provision of sub configurators (e.g. editor, viewer etc
    receive their own configurator)
  */
  addConfigurator(name, configurator) {
    if (!this.config.configurators) {
      this.config.configurators = {}
    }
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

  /*
    Get styles from all configurators
  */
  getStyles() {
    let styles = [].concat(this.config.styles)

    each(this.config.configurators, function(configurator) {
      styles = styles.concat(configurator.getStyles())
    })

    // Remove duplicates with _.uniq, since publisher, author,
    // reader use a lot of shared styles
    return uniq(styles)
  }
}

export default MproConfigurator

import { Configurator } from 'substance'
import each from 'lodash/each'

class ServerConfigurator extends Configurator {

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
    Provision of sub configurators (for different schemas)
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

  getSchemas() {
    let schemas = {}

    each(this.config.configurators, function(configurator) {
      let schema = configurator.getSchema()
      let seed = configurator.getSeed()
      schema.documentFactory = {
        createDocument: configurator.createArticle.bind(configurator, seed)
      }
      schemas[schema.name] = schema
    })

    return schemas
  }
}

export default ServerConfigurator

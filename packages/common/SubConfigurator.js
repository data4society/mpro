import { Configurator } from 'substance'

class SubConfigurator extends Configurator {

  addSeed(seed) {
    this.config.seed = seed
  }

  getSeed() {
    return this.config.seed
  }
}

export default SubConfigurator

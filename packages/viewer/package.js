import CoverPackage from '../cover/package'
import Viewer from './Viewer'

export default {
  name: 'viewer',
  configure: function(config) {
    config.import(CoverPackage)
    config.addComponent('viewer', Viewer)
  }
}

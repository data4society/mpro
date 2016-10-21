import CoverPackage from '../cover/package'
import Editor from './Editor'

export default {
  name: 'editor',
  configure: function(config) {
    config.import(CoverPackage)
    config.addComponent('editor', Editor)
  }
}

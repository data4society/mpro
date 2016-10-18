//import { Overlay } from 'substance'
import CoverPackage from '../cover/package'
import Viewer from './Viewer'
//import ViewerToolbar from './ViewerToolbar'

export default {
  name: 'viewer',
  configure: function(config) {
    config.import(CoverPackage)
    config.addComponent('viewer', Viewer)
    //config.setToolbarClass(ViewerToolbar)
    //config.addComponent('overlay', Overlay)
  }
}

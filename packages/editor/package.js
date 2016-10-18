//import { Overlay } from 'substance'
import CoverPackage from '../cover/package'
import Editor from './Editor'
//import EditorToolbar from './EditorToolbar'

export default {
  name: 'editor',
  configure: function(config) {
    config.import(CoverPackage)
    config.addComponent('editor', Editor)
    //config.setToolbarClass(EditorToolbar)
    //config.addComponent('overlay', Overlay)
  }
}

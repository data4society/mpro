import { substanceGlobals } from 'substance'
import OIDigest from './OIDigest'

substanceGlobals.DEBUG_RENDERING = false

window.onload = function() {
  window.app = OIDigest.mount({
  }, document.getElementById('digest-app'))
}

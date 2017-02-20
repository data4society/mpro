import { substanceGlobals } from 'substance'
import OIDigest from './OIDigest'

substanceGlobals.DEBUG_RENDERING = true

window.onload = function() {
  window.app = OIDigest.mount({
  }, document.getElementById('digest-app'))
}

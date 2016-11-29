import { substanceGlobals } from 'substance'
import Feed from './Feed'

substanceGlobals.DEBUG_RENDERING = true

window.onload = function() {
  window.app = Feed.mount({
  }, document.body)
}

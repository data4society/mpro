import { substanceGlobals } from 'substance'
import Mpro from '../../packages/mpro/Mpro'
import MproConfigurator from '../../packages/mpro/MproConfigurator'
import MproPackage from './package'

substanceGlobals.DEBUG_RENDERING = true
let configurator = new MproConfigurator().import(MproPackage)

window.onload = function() {
  window.app = Mpro.mount({
    configurator: configurator
  }, document.body);
}
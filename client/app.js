'use strict';

var substanceGlobals = require('substance/util/substanceGlobals');
substanceGlobals.DEBUG_RENDERING = true;

var Mpro = require('../packages/mpro/Mpro');
var MproConfigurator = require('../packages/mpro/MproConfigurator');
var MproPackage = require('./package');
var configurator = new MproConfigurator(MproPackage);

window.onload = function() {
  window.app = Scientist.static.mount({
    configurator: configurator
  }, document.body);
};
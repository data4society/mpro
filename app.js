window.SUBSTANCE_DEBUG_RENDERING = true;

var MproApp = require('./client/MproApp');
var Component = require('substance/ui/Component');
var $ = window.$ = require('substance/util/jquery');

// Start the application
$(function() {
  window.app = Component.mount(MproApp, document.body);
});

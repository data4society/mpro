'use strict';

var DocumentClient = require('./MproDocumentClient');
var Err = require('substance/util/Error');

var Component = require('substance/ui/Component');

function Filters() {
  Component.apply(this, arguments);
}

Filters.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-filters');

    return el;
  };

};

Component.extend(Filters);

module.exports = Filters;
'use strict';

var Component = require('substance/ui/Component');
var Facets = require('./Facets');

function Filters() {
  Component.apply(this, arguments);
}

Filters.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-filters');

    el.append($$(Facets, this.props));

    return el;
  };

};

Component.extend(Filters);

module.exports = Filters;
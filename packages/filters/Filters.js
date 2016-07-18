'use strict';

var Component = require('substance/ui/Component');

function Filters() {
  Component.apply(this, arguments);
}

Filters.Prototype = function() {

  this.render = function($$) {
    var componentRegistry = this.context.componentRegistry;
    var Facets = componentRegistry.get('facets');

    var el = $$('div').addClass('sc-filters');

    el.append(
      $$(Facets, this.props)
    );

    return el;
  };

};

Component.extend(Filters);

module.exports = Filters;
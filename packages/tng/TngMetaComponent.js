'use strict';

var Component = require('substance/ui/Component');

function TngMetaComponent() {
  TngMetaComponent.super.apply(this, arguments);
}

TngMetaComponent.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-meta-summary');
    return el;
  };
};

Component.extend(TngMetaComponent);

module.exports = TngMetaComponent;
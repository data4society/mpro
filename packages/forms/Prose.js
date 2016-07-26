'use strict';

var Field = require('./Field');

function Prose() {
  Prose.super.apply(this, arguments);
}

Prose.Prototype = function() {
  
  this.render = function($$) {
    var name = this.getName();
    var config = this.getConfig();
    var value = this.getValue();
    
    var el = $$('div')
      .addClass('sc-field sc-field-prose sc-field-' + name);
    var input = $$('textarea').addClass('sc-textarea').attr({rows: 5}).append(value)
      .ref('input')
      .on('change', this.commit);
    
    el.append(input);

    if(config.placeholder) el.append($$('div').addClass('help').append(config.placeholder));
    
    return el;
  };
};

Field.extend(Prose);

module.exports = Prose;
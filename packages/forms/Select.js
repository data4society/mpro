'use strict';

var each = require('lodash/each');
var Field = require('./Field');

function Select() {
  Select.super.apply(this, arguments);
}

Select.Prototype = function() {
  
  this.getFieldValue = function() {
    var value = this.refs.input.val();
    if(value === 'null') value = null;
    return value;
  };

  this.render = function($$) {
    var name = this.getName();
    var config = this.getConfig();
    var value = this.getValue();

    var select = $$('select').ref('input').on('change', this.commit);

    var option = $$('option').attr({value: null}).append('Unknown');
    if(value === null) option.attr({selected: "selected"});
    select.append(option);

    each(config.options, function(opt) {
      var option = $$('option').attr({value: opt}).append(opt);
      if(opt === value) option.attr({selected: "selected"});
      select.append(option);
    });

    var el = $$('div')
      .addClass('sc-field sc-field-select sc-field-' + name);

    el.append(select);
    
    if(config.placeholder) el.append($$('div').addClass('help').append(config.placeholder));

    return el;
  };
};

Field.extend(Select);

module.exports = Select;
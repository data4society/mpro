'use strict';

var Field = require('./Field');

function Toggle() {
  Toggle.super.apply(this, arguments);
}

Toggle.Prototype = function() {

  this.getFieldValue = function() {
    var value = this.props.value;
    return value;
  };

  this.render = function($$) {
    var name = this.getName();
    var config = this.getConfig();
    var value = this.getValue();

    var el = $$('div')
      .addClass('sc-field sc-field-toggle sc-field-' + name);

    var on = $$('div').addClass('se-on').append('Yes')
      .on('click', this._setOn);
    var off = $$('div').addClass('se-off').append('No')
      .on('click', this._setOff);
    var unknown = $$('div').addClass('se-unknown').append('Unknown')
      .on('click', this._setUnknown);

    if(value === true) {
      on.addClass('active');
    } else if (value === false) {
      off.addClass('active');
    } else {
      unknown.addClass('active');
    }
    
    var item = $$('div').addClass('se-toggle-item').append(
      on,
      off,
      unknown
    );

    el.append(item);

    if(config.placeholder) el.append($$('div').addClass('help').append(config.placeholder));

    return el;
  };

  this._setOn = function() {
    this.extendProps({value: true});
    this.commit();
  };

  this._setOff = function() {
    this.extendProps({value: false});
    this.commit();
  };

  this._setUnknown = function() {
    this.extendProps({value: null});
    this.commit();
  };
};

Field.extend(Toggle);
module.exports = Toggle;
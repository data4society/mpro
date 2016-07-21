'use strict';

var Field = require('./Field');
var each = require('lodash/each');

function Multiple() {
  Multiple.super.apply(this, arguments);
}

Multiple.Prototype = function() {

  this.getInitialState = function() {
    return {
      values: this.props.value
    };
  };

  this.getFieldValue = function() {
    return this.state.values;
  };
  
  this.render = function($$) {
    var name = this.getName();
    var config = this.getConfig();
    var values = this.getValue();

    var el = $$('div').addClass('sc-field sc-field-multiple sc-field-' + name);

    var multipleWidget = $$('div').addClass('se-multiple');
    
    each(values, function(value) {
      multipleWidget.append($$('div').addClass('se-value').append(value).on('click', this.removeValue));
    }.bind(this));

    el.append(
      multipleWidget,
      $$('input').attr({type: 'text', placeholder: 'Add values'})
        .ref('value')
        .on('keyup', this.onKeyUp)
    );

    if(config.placeholder) el.append($$('div').addClass('help').append(config.placeholder));
    
    return el;
  };

  this.onKeyUp = function(e) {
    var key = e.keyCode || e.which;
    var value;
    if (key === 13 || key === 188) {
      value = this.refs.value.val().replace(',', '');
      this.addValue(value);
      return this.refs.value.val('');
    } else if (key === 8) {
      if (this.refs.value.val() === '') {
        value = this.refs.value.val().replace(',', '');
        return this.deleteValue(value);
      }
    }
  };

  this.addValue = function(value) {
    var values = this.state.values;
    values.push(value);
    this.extendState({values: values});
    this.commit();
  };

  this.removeValue = function(e) {
    e.preventDefault();
    var el = e.target;
    var highlighted = el.classList.contains('se-hihglight-remove');
    if(highlighted) {
      this.deleteValue(el.textContent);
    } else {
      each(el.parentElement.childNodes,function(node){
        node.className = 'se-value';
      });
      el.className += ' se-hihglight-remove';
    }
  };

  this.deleteValue = function(value) {
    var values = this.state.values;
    var pos = values.indexOf(value);
    values.splice(pos, 1);
    this.extendState({values: values});
    this.commit();
  };
};

Field.extend(Multiple);

module.exports = Multiple;
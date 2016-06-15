'use strict';

var Component = require('substance/ui/Component');
var each = require('lodash/each');

function ButtonGroup() {
  Component.apply(this, arguments);
}

ButtonGroup.Prototype = function() {

  this.getInitialState = function() {
    var state = {};
    each(this.props.options, function(opt) {
      state[opt.value] = false;
    });
    return state;
  };

  this.render = function($$) {
    var options = this.props.options;

    var el = $$('div').addClass('sc-button-group');

    each(options, function(option) {
      var button = $$('button').addClass('se-button').append(option.name)
          .attr('value', option.value)
          .on('click', this.toggleValue);

      if(this.state[option.value]) button.addClass('active');
      
      el.append(button);
    }.bind(this));

    return el;
  };

  this.toggleValue = function(e) {
    e.preventDefault();
    var value = e.target.value;
    var state = this.state;
    var newState = {};
    newState[value] = !state[value];
    this.extendState(newState);
  };

  this.getValues = function() {
    var state = this.state;
    var values = [];
    each(state, function(val, key){
      if(val) values.push(key);
    });
    return values;
  };

};

Component.extend(ButtonGroup);

module.exports = ButtonGroup;
'use strict';

var Component = require('substance/ui/Component');
var each = require('lodash/each');

function Form() {
  Form.super.apply(this, arguments);

  this.node = this.getNode();
  this.schema = this.getSchema();
  this.fields = {};
}

Form.Prototype = function() {

  this.prepare = function($$) {
    var self = this;
    each(this.schema, function(prop, id) {
      if(prop.field) {
        var config = prop.field;
        var value = self.node[id];
        self.fields[id] = self.createField($$, id, config, value);
      }
    });
  };

  this.getNode = function() {
    return this.props.node;
  };

  this.getSchema = function() {
    var schema = this.node.constructor.static.schema;
    if (schema) {
      return schema;
    } else {
      throw new Error('Contract: Node.static.schema must have a value');
    }
  };

  this.getField = function(type) {
    var field = this.constructor.static.fields[type];
    if(field) {
      return field;
    } else {
      throw new Error('No constructor for field type: ' + type);
    }
  };

  this.createField = function($$, id, config, value) {
    var fieldType = config.type;
    var Field = this.getField(fieldType);
    var el = $$(Field, {id: id, config: config, value: value, form: this});
    return el;
  };

  this.render = function($$) {
    this.prepare($$);

    var el = $$('div')
      .addClass('sc-form');

    each(this.fields, function(field) {
      el.append(field);
    });

    return el;
  };
};

Component.extend(Form);

Form.static.fields = {
  text: require('./Text'),
  checkbox: require('./Checkbox'),
  select: require('./Select'),
  date: require('./Date'),
  radio: require('./Radio'),
  checkboxes: require('./Checkboxes'),
  prose: require('./Prose'),
  toggle: require('./Toggle'),
  multiple: require('./Multiple'),
  reference: require('./Reference')
};

module.exports = Form;
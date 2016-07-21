'use strict';

var Component = require('substance/ui/Component');

function Field() {
  Field.super.apply(this, arguments);
}

Field.Prototype = function() {

  this.getName = function() {
    return this.props.id;
  };

  this.getConfig = function() {
    return this.props.config;
  };

  this.getValue = function() {
    return this.props.value;
  };

  this.getFieldValue = function() {
    return this.refs.input.val();
  };

  this.getSession = function() {
    var form = this.props.form;
    return form.props.session;
  };

  this.getNodeId = function() {
    return this.props.form.node.id;
  };

  this.commit = function() {
    var session = this.getSession();
    var nodeId = this.getNodeId();
    var propId = this.props.id;
    var value = this.getFieldValue();

    session.transaction(function(tx) {
      tx.set([nodeId, propId], value);
    });
  };
  
  this.render = function($$) {
    return $$('div')
      .addClass('sc-field');
  };
};

Component.extend(Field);

module.exports = Field;
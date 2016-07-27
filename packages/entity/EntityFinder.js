'use strict';

var Component = require('substance/ui/Component');
var Button = require('substance/ui/Button');
var isEmpty = require('lodash/isEmpty');
var find = require('lodash/find');
var each = require('lodash/each');
var map = require('lodash/map');

function EntityFinder() {
  EntityFinder.super.apply(this, arguments);
}

EntityFinder.Prototype = function() {

  this.getInitialState = function() {
    var state = {
      selected: {},
      dropdown: false,
      options: []
    };

    return state;
  };

  this.getValue = function() {
    return this.state.selected.id;
  };
  
  this.render = function($$) {
    var el = $$('div').addClass('sc-entity-finder');
    
    var selected = this.state.selected;
    
    if(!isEmpty(selected)) {
      var multipleWidget = $$('div').addClass('se-results');

      multipleWidget.append(
        $$('div').addClass('se-value').append(selected.name)
          .attr('data-id', selected.id)
          .on('click', this.removeValue)
      );

      el.append(
        multipleWidget,
        $$(Button).addClass('se-button-done').append('Done')
          .on('click', this._onClickDone)
      );
    } else {
      el.append(
        $$('input').attr({type: 'text', placeholder: this.getLabel('reference-select')})
          .ref('value')
          .on('keyup', this.onKeyUp)
          .on('blur', this.onBlur),
        $$(Button).addClass('se-button-create').append('+ Add')
          .on('click', this._createEntity)
      );
    }

    if(this.state.dropdown) {
      var options = this.state.options;
      var ids = map(selected, 'id');
      var list = $$('ul').addClass('se-dropdown-list');
     
      if(options.length > 0) {
        each(options, function(option) {
          var item = $$('li').addClass('se-dropdown-item').append(option.name)
            .attr('data-id', option.id);

          if(ids.indexOf(option.id) > -1) {
            item.addClass('se-disabled-item');
          } else {
            item.on('click', this.addValue);
          }

          list.append(item);
        }.bind(this));
      } else {
        var item = $$('li').addClass('se-dropdown-item se-disabled-item')
          .append(this.getLabel('reference-empty-value'));
        list.append(item);
      }
      el.append(list);
    }

    el.append($$('div').addClass('help').append('Select entity from list'));
    
    return el;
  };

  this.prepareList = function(value) {
    var dataClient = this.context.documentClient;
    var restrictions = { entity_class: this.props.entityClass };

    dataClient.findEntities(value, restrictions, function(err, res) {
      if (err) {
        console.error(err);
        return;
      }

      var options = map(res, function(e) {return {id: e.entity_id, name: e.name}; });
      this.extendState({options: options, dropdown: true});
    }.bind(this));
  };

  this.onKeyUp = function() {
    //var key = e.keyCode || e.which;
    var value = this.refs.value.val();
    this.prepareList(value);
  };

  this.onBlur = function() {
    this.refs.value.val('');
    setTimeout(function() {
      this.extendState({dropdown: false});
    }.bind(this), 300);
  };

  this.addValue = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var id = e.target.dataset.id;
    var value = find(this.state.options, function(item) { return item.id === id; });
    this.refs.value.val('');
    this.extendState({selected: value, dropdown: false});
  };

  this.removeValue = function(e) {
    e.preventDefault();
    var el = e.target;
    var highlighted = el.classList.contains('se-hihglight-remove');
    if(highlighted) {
      this.deleteValue(el.dataset.id);
    } else {
      each(el.parentElement.childNodes,function(node){
        node.className = 'se-value';
      });
      el.className += ' se-hihglight-remove';
    }
  };

  this.deleteValue = function() {
    this.extendState({selected: {}});
  };

  this._createEntity = function() {
    var dataClient = this.context.documentClient;

    var entityData = {
      entity_class: this.props.entityClass
    };

    dataClient.createEntity(entityData, function(err, res) {
      if (err) {
        console.error(err);
        return;
      }
      
      var reference = res.entity_id;
      this.send('createReference', reference);
    }.bind(this));
  };

  this._onClickDone = function(e) {
    e.preventDefault();
    this.send('createReference', this.getValue());
  };
};

Component.extend(EntityFinder);

module.exports = EntityFinder;
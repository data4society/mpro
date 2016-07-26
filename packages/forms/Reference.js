'use strict';

var Field = require('./Field');
var extend = require('lodash/extend');
var filter = require('lodash/filter');
var isEmpty = require('lodash/isEmpty');
var find = require('lodash/find');
var each = require('lodash/each');
var map = require('lodash/map');

function Reference() {
  Reference.super.apply(this, arguments);
}

Reference.Prototype = function() {

  this.didMount = function() {
    this._loadOptions();
  };

  this.getInitialState = function() {
    var state = {
      selected: this.props.value,
      dropdown: false,
      options: []
    };

    return state;
  };

  this.getFieldValue = function() {
    var config = this.getConfig();
    var value = map(this.state.selected, 'id');

    if(!config.multiple) {
      value = value[0] || '';
    }
    return value;
  };
  
  this.render = function($$) {
    var name = this.getName();
    var config = this.getConfig();

    var el = $$('div').addClass('sc-field sc-field-multiple sc-field-' + name);

    var multipleWidget = $$('div').addClass('se-multiple');
    
    each(this.state.selected, function(value) {
      multipleWidget.append(
        $$('div').addClass('se-value').append(value.name)
          .attr('data-id', value.id)
          .on('click', this.removeValue)
      );
    }.bind(this));

    el.append(multipleWidget);
    
    if(this.state.selected.length < 1 || config.multiple) {
      el.append(
        $$('input').attr({type: 'text', placeholder: this.getLabel('reference-select')})
          .ref('value')
          .on('keyup', this.onKeyUp)
          .on('blur', this.onBlur)
      );
    }

    if(this.state.dropdown) {
      var options = this.state.options;
      var selected = this.state.selected;
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

    if(config.placeholder) el.append($$('div').addClass('help').append(config.placeholder));
    
    return el;
  };

  this.prepareList = function(value) {
    var dataClient = this.context.documentClient;
    var config = this.getConfig();
    var restrictions = config.restrictions;

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
    }.bind(this), 100);
  };

  this.addValue = function(e) {
    var config = this.getConfig();
    var id = e.target.dataset.id;
    var selected = this.state.selected;
    var value = find(this.state.options, function(item) { return item.id === id; });
    if(!config.multiple) {
      selected = [];
    }
    selected.push(value);
    this.refs.value.val('');
    this.extendState({selected: selected, dropdown: false});
    this.commit();
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

  this.deleteValue = function(id) {
    var selected = this.state.selected;
    selected = filter(selected, function(item) { return item.id !== id; });
    this.extendState({selected: selected});
    this.commit();
  };

  this._loadOptions = function() {
    var config = this.getConfig();
    var selected = this.state.selected;
    var dataClient = this.context.documentClient;
    var restrictions = extend({}, config.restrictions, {entity_id: selected});

    if(!isEmpty(selected)) {
      dataClient.findEntities('', restrictions, function(err, res) {
        if (err) {
          console.error(err);
          return;
        }
        each(res, function(item) {
          item.id = item.entity_id;
        });
        this.extendState({selected: res});
      }.bind(this));
    }
  };
};

Field.extend(Reference);

module.exports = Reference;
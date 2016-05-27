'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');
var each = require('lodash/each');

var CategoriesList = function() {
  CategoriesList.super.apply(this, arguments);
};

CategoriesList.Prototype = function() {

  this.render = function($$) {
    var doc = this.context.controller.getDocument();
    var categories = doc.get(['meta','categories']);
    var thematics = this.props.thematics;
    var categoriesList = [];

    var el = $$('div').addClass('sc-categories-list');

    if(thematics) {
      each(categories, function(category) {
        var item = thematics.get(category);
        thematics.nodes[category].selected = true;
        categoriesList.push(item.title);
      }.bind(this));
    }

    el.append($$(Icon, {icon: 'fa-tags'}));

    if(categoriesList.length > 0) {
      el.append($$('div').addClass('se-categories').append(categoriesList.join(', ')));
      if(this.props.editing !== 'readonly') {
        el.append(
          $$('div').addClass('se-edit-categories')
            .append($$(Icon, {icon: 'fa-pencil'}))
            .on('click', this._openThematicEditor.bind(this))
        );
      }
    } else {
      el.append($$('div').addClass('se-categories').append('No categories were attached to this document.'));
      if(this.props.editing !== 'readonly') {
        el.append(
          $$('div').addClass('se-edit-categories')
            .append(
              'Want to add some?'
            )
            .on('click', this._openThematicEditor.bind(this))
        );
      }
    }

    return el;
  };

  this._openThematicEditor = function() {
    this.parent.refs.thematics.togglePrompt();
  };
};

Component.extend(CategoriesList);

module.exports = CategoriesList;
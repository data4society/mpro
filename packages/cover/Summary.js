'use strict';

var Component = require('substance/ui/Component');
var isEmpty = require('lodash/isEmpty');
var groupBy = require('lodash/groupBy');
var each = require('lodash/each');
var map = require('lodash/map');
var moment = require('moment');

var Summary = function() {
  Summary.super.apply(this, arguments);
};

Summary.Prototype = function() {

  this.render = function($$) {
    var componentRegistry = this.context.componentRegistry;
    var MetaSummary = componentRegistry.get('meta-summary');

    var el = $$('div').addClass('sc-document-summary');
    if (this.props.mobile) {
      el.addClass('sm-mobile');
    }
    
    var rubricsList = this.renderRubricsList($$);

    el.append(
      $$(MetaSummary),
      rubricsList,
      $$('div').addClass('se-separator')
    );

    return el;
  };

  this.renderRubricsList = function($$) {
    var document = this.context.doc;
    var rubrics = this.props.rubrics;
    var selectedRubrics = document.get(['meta', 'rubrics']);
    var rubricsList = [];

    var el = $$('div').addClass('se-rubrics');
    if(isEmpty(rubrics)) return el;

    each(selectedRubrics, function(id) {
      var item = {
        name: rubrics.get([id, 'name']),
        root: rubrics.getRootParent(id).name
      }
      rubricsList.push(item);
    });

    el.append(this.context.iconProvider.renderIcon($$, 'rubrics'));

    var listEl = $$('div').addClass('sm-item');

    if(rubricsList.length > 0) {
      var groupedList = groupBy(rubricsList, 'root');

      each(groupedList, function(list, key) {
        var leaf = key.charAt(0).toUpperCase() + key.slice(1);
        listEl.append(leaf + ': ' + map(list, 'name').join(', '));
      });
    } else {
      listEl.append(this.getLabel('no-rubrics'));
    }

    el.append(listEl);
    return el;
  };

};

Component.extend(Summary);

module.exports = Summary;
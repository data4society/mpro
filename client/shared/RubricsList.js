'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');
var each = require('lodash/each');

var RubricsList = function() {
  RubricsList.super.apply(this, arguments);
};

RubricsList.Prototype = function() {

  this.render = function($$) {
    var doc = this.context.controller.getDocument();
    var rubricsMeta = doc.get(['meta','rubrics']);
    var rubrics = this.props.rubrics;
    var rubricsList = [];

    var el = $$('div').addClass('sc-rubrics-list');

    if(rubrics) {
      each(rubricsMeta, function(rubric) {
        var item = rubrics.get(rubric);
        rubrics.nodes[rubric].selected = true;
        rubricsList.push(item.name);
      }.bind(this));
    }

    el.append($$(Icon, {icon: 'fa-tags'}));

    if(rubricsList.length > 0) {
      el.append($$('div').addClass('se-rubrics').append(rubricsList.join(', ')));
      if(this.props.editing !== 'readonly') {
        el.append(
          $$('div').addClass('se-edit-rubrics')
            .append($$(Icon, {icon: 'fa-pencil'}))
            .on('click', this._openRubricEditor.bind(this))
        );
      }
    } else {
      el.append($$('div').addClass('se-rubrics').append('No rubrics were attached to this document.'));
      if(this.props.editing !== 'readonly') {
        el.append(
          $$('div').addClass('se-edit-rubrics')
            .append(
              'Want to add some?'
            )
            .on('click', this._openRubricEditor.bind(this))
        );
      }
    }

    return el;
  };

  this._openRubricEditor = function() {
    this.parent.refs.rubrics.togglePrompt();
  };
};

Component.extend(RubricsList);

module.exports = RubricsList;
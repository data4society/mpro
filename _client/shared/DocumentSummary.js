'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');
var RubricsList = require('./RubricsList');
var RubricEditor = require('./RubricEditor');
var moment = require('moment');

var DocumentSummary = function() {
  DocumentSummary.super.apply(this, arguments);
};

DocumentSummary.Prototype = function() {

  this.render = function($$) {
    var document = this.context.doc;
    //var documentInfo = this.props.documentInfo.props;
    var rubrics = this.props.rubrics;
    //var updatedAt = moment(documentInfo.updatedAt).fromNow();

    var el = $$('div').addClass('sc-document-summary');
    if (this.props.mobile) {
      el.addClass('sm-mobile');
    }
   
    el.append($$(RubricsList, {
      rubrics: rubrics,
    }).ref('rubricsList'));

    el.append(
      $$(RubricEditor, {
        rubrics: rubrics
      }).ref('rubrics')
    );

    if(document.schema.name == 'mpro-vk') {
      el.append(
        this.renderMeta($$),
        $$('div').addClass('se-separator')
      );
    }

    // el.append(
    //   $$('div').addClass('se-item').append(
    //     'Updated ',
    //     updatedAt,
    //     ' by ',
    //     documentInfo.updatedBy
    //   )
    // );
    return el;
  };

  this.renderMeta = function($$) {
    var document = this.context.doc;
    var meta = document.get('meta');
    var el = $$('div').addClass('se-meta-summary');
    var text = $$('div').addClass('se-published').append(
      $$(Icon, {icon: 'fa-clock-o'}),
      'Published by ' + meta.author.name + ' on ' + moment(meta.published).format('DD.MM.YYYY HH:mm')
    );
    var source = $$('div').addClass('se-source').append(
      $$(Icon, {icon: 'fa-chain'}),
      'Original source: ',
      $$('a').addClass('se-source-url')
        .setAttribute('href', meta.source)
        .setAttribute('target', '_blank')
        .append(
          meta.source
        )
    );

    el.append(
      text,
      source
    );

    return el;
  };

  this._openRubricsEditor = function() {
    this.refs.rubrics.togglePrompt();
  };
};

Component.extend(DocumentSummary);

module.exports = DocumentSummary;
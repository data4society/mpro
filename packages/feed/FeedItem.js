'use strict';

var Component = require('substance/ui/Component');
var isEmpty = require('lodash/isEmpty');
var each = require('lodash/each');
var moment = require('moment');

function FeedItem() {
  Component.apply(this, arguments);
}

FeedItem.Prototype = function() {

  this.render = function($$) {
    var document = this.props.document;
    var meta = document.meta;
    var el = $$('div').addClass('sc-feed-item')
      .on('click', this.send.bind(this, 'openDocument', document.documentId));

    var isActive = this.props.active === true;

    if(isActive) {
      el.addClass('active');
    }

    var rubrics = this.renderRubrics($$);
    var source = this.renderSourceInfo($$);

    el.append(
      rubrics,
      source
    );

    if(meta.title !== '') {
      el.append(
        $$('div').addClass('se-title')
          .append(meta.title)
      );
    }

    el.append(
      $$('div').addClass('se-abstract')
        .append(meta.abstract),
      $$('div').addClass('se-separator')
    );

    return el;
  };

  this.renderRubrics = function($$) {
    var document = this.props.document;
    var meta = document.meta;
    var rubrics = this.props.rubrics;
    var rubricsMeta = meta.rubrics;
    var rubricsList = [];

    if(!isEmpty(rubrics)) {
      each(rubricsMeta, function(rubric) {
        var item = rubrics.get(rubric);
        rubricsList.push(item.name);
      }.bind(this));
    }

    var rubricsEl = $$('div').addClass('se-rubrics');
    rubricsEl.append(this.context.iconProvider.renderIcon($$, 'rubrics'));

    if(rubricsList.length > 0) {
      rubricsEl.append(rubricsList.join(', '));
    } else {
      rubricsEl.append('No categories assigned');
    }

    return rubricsEl;
  };

  this.renderSourceInfo = function($$) {
    var document = this.props.document;
    var meta = document.meta;
    var published = this.props.document.published;
    var publisher = meta.publisher;
    var source_name = meta.source.split('/')[2];

    var el = $$('div').addClass('se-source-info');

    el.append(
      $$('div').addClass('se-source-name').append(
        publisher
      ),
      $$('a').addClass('se-source-url')
        .setAttribute('href', meta.source)
        .setAttribute('target', '_blank')
        .append(
          source_name
        ),
      $$('div').addClass('se-source-date').html(
        moment(published).format('DD.MM.YYYY HH:mm')
      )
    );

    return el;
  };
};

Component.extend(FeedItem);

module.exports = FeedItem;
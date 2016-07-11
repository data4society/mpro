'use strict';

var Component = require('substance/ui/Component');
var each = require('lodash/each');
var moment = require('moment');

function FeedItem() {
  Component.apply(this, arguments);

  if (!this.context.urlHelper) {
    throw new Error('FeedItem requires urlHelper.');
  }
}

FeedItem.Prototype = function() {

  this.render = function($$) {
    var document = this.props.document;
    var el = $$('div').addClass('sc-feed-item')
      .on('click', this.send.bind(this, 'openDocument', document.documentId));

    var isActive = this.props.active === true;

    if(isActive) {
      el.addClass('active');
    }

    var meta = document.meta;

    var rubrics = this.props.rubrics;
    var rubricsMeta = meta.rubrics;

    var rubricsList = [];

    if(rubrics) {
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

    el.append(
      rubricsEl,
      this.renderSourceInfo($$)
    );

    if(document.title !== '') {
      el.append(
        $$('div').addClass('se-title')
          .append(document.title)
      );
    }

    el.append(
      $$('div').addClass('se-abstract')
        .append(meta.abstract),
      $$('div').addClass('se-separator')
    );

    return el;
  };

  this.renderSourceInfo = function($$) {
    var document = this.props.document;
    var meta = document.meta;
    var published = this.props.document.published;
    var publisher = meta.publisher;
    var source_name = meta.source.split('/')[2];

    if(document.schema_name == 'mpro-vk') {
      publisher = meta.author.name;
      source_name = this.context.iconProvider.renderIcon($$, 'vk');
    }

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
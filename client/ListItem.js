'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');
var each = require('lodash/each');
var moment = require('moment');

function ListItem() {
  Component.apply(this, arguments);

  if (!this.context.urlHelper) {
    throw new Error('FeedItem requires urlHelper.');
  }
}

ListItem.Prototype = function() {

  this.render = function($$) {
    var document = this.props.document;
    var el = $$('div').addClass('sc-list-item')
      .on('click', this.send.bind(this, 'openDocument', document.documentId));

    var isActive = this.props.active === true;

    var rubrics = this.props.rubrics;
    var meta = document.meta;
    var categories = meta.categories;

    if(isActive) {
      el.addClass('active');
    }

    var categoriesList = [];

    if(rubrics) {
      each(categories, function(category) {
        var item = rubrics.get(category);
        categoriesList.push(item.title);
      }.bind(this));
    }

    var categoriesEl = $$('div').addClass('se-categories');

    categoriesEl.append($$(Icon, {icon: 'fa-tags'}));

    if(categoriesList.length > 0) {
      categoriesEl.append(categoriesList.join(', '));
    } else {
      categoriesEl.append('No categories assigned');
    }

    // Title
    el.append(
      $$('div').addClass('se-title')
        .append(document.title),
      categoriesEl,
      $$('div').addClass('se-separator')
    );

    // TODO: Add HTML preview here
    // el.append(
    //   $$('div').addClass('se-preview').append(
    //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mattis tincidunt massa, ac lacinia mauris facilisis ut. Cras vitae neque leo. Donec convallis erat rutrum dui sagittis, id bibendum urna tincidunt. Donec sed augue non erat maximus suscipit eu ut turpis. Nam placerat dui nec dictum consequat. Nam eu enim porta, aliquet elit quis, condimentum ipsum. Donec dignissim ac lectus vitae porttitor.....'
    //   )
    // );

    // Creator + collaborators |  updatedAt
    // var authors = [];
    // authors.push($$('strong').append(this.props.creator || 'Anonymous'));
    // // if (this.props.collaborators.length > 0) {
    // //   authors.push(' with ');
    // //   authors.push(this.props.collaborators.join(', '));
    // // }

    // var updatedAt = [
    //   'Updated ',
    //   moment(this.props.updatedAt).fromNow(),
    //   'by',
    //   this.props.updatedBy || 'Anonymous'
    // ];

    // el.append(
    //   $$('div').addClass('se-meta').append(
    //     $$('span').addClass('se-meta-item se-authors').append(authors),
    //     $$('span').addClass('se-meta-item se-updated-at').append(updatedAt.join(' ')),
    //     $$('button').addClass('se-meta-item se-delete').append('Delete')
    //       .on('click', this.send.bind(this, 'deleteNote', this.props.documentId))
    //   )
    // );
    return el;
  };

  this.renderSourceInfo = function($$) {
    var meta = this.props.document.meta;
    var issue_date = this.props.document.issue_date;
    var el = $$('div').addClass('se-source-info');

    el.append(
      $$('div').addClass('se-source-name').html(
        meta.publisher
      ),
      $$('a').addClass('se-source-url')
        .setAttribute('href', meta.source)
        .setAttribute('target', '_blank')
        .append(
          meta.source.split('/')[2]
        ),
      $$('div').addClass('se-source-date').html(
        moment(issue_date).format('DD.MM.YYYY HH:mm')
      )
    );

    return el;
  };
};

Component.extend(ListItem);

module.exports = ListItem;
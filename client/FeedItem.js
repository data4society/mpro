'use strict';

var Component = require('substance/ui/Component');
var moment = require('moment');

function FeedItem() {
  Component.apply(this, arguments);

  if (!this.context.urlHelper) {
    throw new Error('FeedItem requires urlHelper.');
  }
}

FeedItem.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-feed-item');

    var isActive = this.props.active === true;

    if(isActive) {
      el.addClass('active');
    }

    var urlHelper = this.context.urlHelper;
    var url = urlHelper.openNote(this.props.documentId);

    var meta = this.props.meta;

    // Title
    el.append(
      this.renderSourceInfo($$),
      $$('div').addClass('se-title')
        .append(this.props.title)
        .on('click', this.send.bind(this, 'openDocument', this.props.documentId)),
      $$('div').addClass('se-abstract')
        .append(meta.abstract)
        // .append(
        //   $$('a')
        //     .attr({href: url})
        //     .append(this.props.title)
        // )
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
    var meta = this.props.meta;
    var issue_date = this.props.issue_date;
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

Component.extend(FeedItem);

module.exports = FeedItem;

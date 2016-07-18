'use strict';

var Button = require('substance/ui/Button');
var FeedItem = require('../feed/FeedItem');
var moment = require('moment');

function TngFeedItem() {
  FeedItem.apply(this, arguments);
}

TngFeedItem.Prototype = function() {

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

    var deleteBtn = $$(Button).addClass('se-delete-document').append(this.getLabel('delete-document'))
        .on('click', this.send.bind(this, 'deleteDocument', document.documentId));

    if(meta.accepted) {
      el.addClass('sm-accepted');
    } else {
      el.addClass('sm-not-accepted');
    }

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
      deleteBtn,
      $$('div').addClass('se-separator')
    );

    return el;
  };

  this.renderSourceInfo = function($$) {
    var meta = this.props.document.meta;
    var issue_date = this.props.document.issue_date;
    var el = $$('div').addClass('se-source-info');

    el.append(
      $$('div').addClass('se-source-name').append(
        meta.source_type
      ),
      $$('div').addClass('se-source-url').append(
        //meta.source.split('/')[2]
      ),
      $$('div').addClass('se-source-date').html(
        moment(issue_date).format('DD.MM.YYYY HH:mm')
      )
    );

    return el;
  };
};

FeedItem.extend(TngFeedItem);

module.exports = TngFeedItem;
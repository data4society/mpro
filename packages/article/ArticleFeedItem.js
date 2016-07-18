'use strict';

var FeedItem = require('../feed/FeedItem');
var moment = require('moment');

function ArticleFeedItem() {
  FeedItem.apply(this, arguments);
}

ArticleFeedItem.Prototype = function() {

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
      $$('div').addClass('se-source-url').append(
        source_name
      ),
      $$('div').addClass('se-source-date').html(
        moment(published).format('DD.MM.YYYY HH:mm')
      )
    );

    return el;
  };
};

FeedItem.extend(ArticleFeedItem);

module.exports = ArticleFeedItem;
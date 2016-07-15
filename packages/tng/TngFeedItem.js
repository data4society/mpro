'use strict';

var FeedItem = require('../feed/FeedItem');
var moment = require('moment');

function TngFeedItem() {
  FeedItem.apply(this, arguments);
}

TngFeedItem.Prototype = function() {

  this.renderSourceInfo = function($$) {
    var meta = this.props.document.meta;
    var issue_date = this.props.document.issue_date;
    var el = $$('div').addClass('se-source-info');

    el.append(
      $$('div').addClass('se-source-name').append(
        meta.publisher
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
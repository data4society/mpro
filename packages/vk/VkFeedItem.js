'use strict';

var FeedItem = require('../feed/FeedItem');
var moment = require('moment');

function VkFeedItem() {
  FeedItem.apply(this, arguments);
}

VkFeedItem.Prototype = function() {

  this.renderSourceInfo = function($$) {
    var document = this.props.document;
    var meta = document.meta;
    var published = this.props.document.published;
    var publisher = meta.author.name;
    var source_name = this.context.iconProvider.renderIcon($$, 'vk');
    
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

FeedItem.extend(VkFeedItem);

module.exports = VkFeedItem;
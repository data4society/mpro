'use strict';

var Component = require('substance/ui/Component');
var Button = require('substance/ui/Button');

function Pager() {
  Component.apply(this, arguments);
}

Pager.Prototype = function() {

  this.render = function($$) {
    var total = this.props.total;
    var loaded = this.props.loaded;
    var isLastPage = loaded >= total;

    var el = $$('div').addClass('sc-pager');

    var btn = $$(Button, {disabled: isLastPage}).append('Load more')
      .on('click', this._loadMore);

    el.append(btn);

    return el;
  };

  this._loadMore = function() {
    this.send('loadMore');
  };

};

Component.extend(Pager);

module.exports = Pager;
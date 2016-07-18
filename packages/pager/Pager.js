'use strict';

var Component = require('substance/ui/Component');
var Button = require('substance/ui/Button');

function Pager() {
  Component.apply(this, arguments);
}

Pager.Prototype = function() {

  this.render = function($$) {
    var total = this.props.total;
    var page = this.props.page;
    var perPage = this.props.perPage;
    var isLastPage = page * perPage >= total;

    var el = $$('div').addClass('sc-pager');

    var btn = $$(Button, {disabled: isLastPage}).append('Load more')
      .on('click', this._loadMore);

    el.append(btn);

    return el;
  };

  this._loadMore = function() {
    var page = this.props.page;
    this.send('loadMore', page + 1);
  };

};

Component.extend(Pager);

module.exports = Pager;
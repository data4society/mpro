'use strict';

var Component = require('substance/ui/Component');
var moment = require('moment');

function ArticleMetaComponent() {
  ArticleMetaComponent.super.apply(this, arguments);
}

ArticleMetaComponent.Prototype = function() {

  this.render = function($$) {
    var document = this.context.doc;
    var meta = document.get('meta');
    var el = $$('div').addClass('sc-meta-summary');
    var published = $$('div').addClass('se-published').append(
      this.context.iconProvider.renderIcon($$, 'published'),
      $$('div').addClass('sm-item').append(
        this.getLabel('published-by') + ' ' + meta.publisher,
        this.getLabel('published-date') + ' ',
        moment(meta.published).format('DD.MM.YYYY HH:mm')
      )
    );
    var source = $$('div').addClass('se-source').append(
      this.context.iconProvider.renderIcon($$, 'source'),
      $$('div').addClass('sm-item').append(
        this.getLabel('source') + ' ',
        $$('a').addClass('se-source-url')
          .setAttribute('href', meta.source)
          .setAttribute('target', '_blank')
          .append(
            meta.source
          )
      )
    );

    el.append(
      published,
      source
    );

    return el;
  };
};

Component.extend(ArticleMetaComponent);

module.exports = ArticleMetaComponent;
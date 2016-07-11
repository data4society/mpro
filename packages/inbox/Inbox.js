'use strict';

var extend = require('lodash/extend');
var Component = require('substance/ui/Component');
var ScrollPane = require('substance/ui/ScrollPane');
var DoubleSplitPane = require('../common/DoubleSplitPane');

/*
  Represents Inbox page.

  Component splits into three parts:
  - Filters
  - Feed
  - Document Viewer
*/
function Inbox() {
  Component.apply(this, arguments);
}

Inbox.Prototype = function() {

  this.render = function($$) {
    var componentRegistry = this.context.componentRegistry;
    var Header = componentRegistry.get('header');
    var Feed = componentRegistry.get('feed');

    var el = $$('div').addClass('sc-inbox');

    el.append($$(Header, {
      actions: {
        'configurator': this.getLabel('configurator-menu')
      }
    }));

    el.append(
      $$(DoubleSplitPane, {splitType: 'vertical', sizeA: '300px', sizeB: '40%'}).append(
        $$('div').addClass('test1'),
        $$(ScrollPane, {
          scrollbarType: 'substance',
          scrollbarPosition: 'left'
        }).append(
          $$(Feed, extend({}, this.props, {rubrics: ''})).ref('feed')
        ),
        $$('div').addClass('test3')
      )
    );

    return el;
  };

};

Component.extend(Inbox);

module.exports = Inbox;
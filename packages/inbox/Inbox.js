'use strict';

var Component = require('substance/ui/Component');
var DoubleSplitPane = require('../common/DoubleSplitPane');

function Inbox() {
  Component.apply(this, arguments);
}

Inbox.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-inbox');

    el.append(
      $$(DoubleSplitPane, {splitType: 'vertical', sizeA: '300px', sizeB: '40%'}).append(
        $$('div').addClass('test1'),
        $$('div').addClass('test2')
      )
    );

    return el;
  };

};

Component.extend(Inbox);

module.exports = Inbox;
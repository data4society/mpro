'use strict';

var Component = require('substance/ui/Component');
var Inbox = require('./InboxSection');
var Welcome = require('./Welcome');
var EnterName = require('./EnterName');

function IndexSection() {
  Component.apply(this, arguments);
}

IndexSection.Prototype = function() {
  this.render = function($$) {
    var el = $$('div').addClass('sc-index-section');
    var userSession = this.props.userSession;

    if (!userSession) {
      el.append($$(Welcome).ref('welcome'));
    } else if (userSession.user.name) {
      el.append($$(Inbox, this.props).ref('inbox'));
    } else {
      el.append($$(EnterName, this.props).ref('enterName'));
    }
    return el;
  };
};

Component.extend(IndexSection);

module.exports = IndexSection;
'use strict';

var Command = require('substance/ui/Command');

function AcceptorCommand() {
  AcceptorCommand.super.apply(this, arguments);
}

AcceptorCommand.Prototype = function() {
  this.getCommandState = function(props, context) {
    var doc = context.doc;
    var accepted = doc.get(['meta', 'accepted']);
    return {
      disabled: false,
      active: false,
      accepted: accepted
    };
  };

  this.execute = function(props, context) {
    var docSession = context.documentSession;
    var currentValue = docSession.doc.get(['meta', 'accepted']);
    docSession.transaction(function(tx) {
      tx.set(['meta', 'accepted'], !currentValue);
    });
    return true;
  };
};

Command.extend(AcceptorCommand);
AcceptorCommand.static.name = 'acceptor';

module.exports = AcceptorCommand;
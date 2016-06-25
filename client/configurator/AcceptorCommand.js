'use strict';

var ControllerCommand = require('substance/ui/ControllerCommand');

function AcceptorCommand() {
  AcceptorCommand.super.apply(this, arguments);
}

AcceptorCommand.Prototype = function() {

  this.getCommandState = function() {
    return {
      disabled: false,
      active: false
    };
  };

  this.execute = function() {
    var docSession = this.getDocumentSession();
    var currentValue = docSession.doc.get(['meta', 'accepted']);
    docSession.transaction(function(tx) {
      tx.set(['meta', 'accepted'], !currentValue);
    });
    this.controller.send('acceptArticle', docSession.documentId, !currentValue);
    return true;
  };
};

ControllerCommand.extend(AcceptorCommand);

AcceptorCommand.static.name = 'acceptor';

module.exports = AcceptorCommand;
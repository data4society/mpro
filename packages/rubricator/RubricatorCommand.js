'use strict';

var Command = require('substance/ui/Command');

function RubricatorCommand() {
  RubricatorCommand.super.apply(this, arguments);
}

RubricatorCommand.Prototype = function() {
  this.getCommandState = function() {
    return {
      disabled: false,
      active: false
    };
  };

  this.execute = function(props) {
    var documentSession = props.documentSession;
    var rubrics = props.rubrics;
    documentSession.transaction(function(tx) {
      tx.set(['meta', 'rubrics'], rubrics);
    });
    return true;
  };
};

Command.extend(RubricatorCommand);
RubricatorCommand.static.name = 'rubricator';

module.exports = RubricatorCommand;
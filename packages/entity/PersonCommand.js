'use strict';

var EntityCommand = require('./EntityCommand');

function PersonCommand() {
  PersonCommand.super.apply(this, arguments);
}

EntityCommand.extend(PersonCommand);

PersonCommand.static.name = 'person';

module.exports = PersonCommand;
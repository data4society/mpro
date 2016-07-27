'use strict';

var EntityCommand = require('./EntityCommand');

function ActCommand() {
  ActCommand.super.apply(this, arguments);
}

EntityCommand.extend(ActCommand);

ActCommand.static.name = 'norm_act';

module.exports = ActCommand;
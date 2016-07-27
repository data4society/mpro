'use strict';

var EntityCommand = require('./EntityCommand');

function LocationCommand() {
  LocationCommand.super.apply(this, arguments);
}

EntityCommand.extend(LocationCommand);

LocationCommand.static.name = 'location';

module.exports = LocationCommand;
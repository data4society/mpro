'use strict';

var EntityCommand = require('./EntityCommand');

function OrgCommand() {
  OrgCommand.super.apply(this, arguments);
}

EntityCommand.extend(OrgCommand);

OrgCommand.static.name = 'org';

module.exports = OrgCommand;
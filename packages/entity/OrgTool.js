'use strict';

var EntityTool = require('./EntityTool');

function OrgTool() {
  OrgTool.super.apply(this, arguments);
}

EntityTool.extend(OrgTool);

OrgTool.static.name = 'org';

module.exports = OrgTool;
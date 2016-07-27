'use strict';

var EntityTool = require('./EntityTool');

function ActTool() {
  ActTool.super.apply(this, arguments);
}

EntityTool.extend(ActTool);

ActTool.static.name = 'norm_act';

module.exports = ActTool;
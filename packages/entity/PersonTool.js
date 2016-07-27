'use strict';

var EntityTool = require('./EntityTool');

function PersonTool() {
  PersonTool.super.apply(this, arguments);
}

EntityTool.extend(PersonTool);

PersonTool.static.name = 'person';

module.exports = PersonTool;
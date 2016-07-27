'use strict';

var EntityTool = require('./EntityTool');

function LocationTool() {
  LocationTool.super.apply(this, arguments);
}

EntityTool.extend(LocationTool);

LocationTool.static.name = 'location';

module.exports = LocationTool;
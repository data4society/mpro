'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

function EntityTool() {
  EntityTool.super.apply(this, arguments);
}

AnnotationTool.extend(EntityTool);

EntityTool.static.name = 'entity';

module.exports = EntityTool;
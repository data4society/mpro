'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

function EntityCommand() {
  EntityCommand.super.apply(this, arguments);
}

AnnotationCommand.extend(EntityCommand);

EntityCommand.static.name = 'entity';
EntityCommand.static.annotationType = 'entity';

module.exports = EntityCommand;
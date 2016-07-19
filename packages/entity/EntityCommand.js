'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

function EntityCommand() {
  EntityCommand.super.apply(this, arguments);
}

EntityCommand.Prototype = function() {
  this.canEdit = function(annos, sel) { // eslint-disable-line
    return annos.length === 1;
  };
};

AnnotationCommand.extend(EntityCommand);

EntityCommand.static.name = 'entity';

module.exports = EntityCommand;
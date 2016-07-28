'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');
var createAnnotation = require('substance/model/transform/createAnnotation');

function EntityCommand() {
  EntityCommand.super.apply(this, arguments);
}

EntityCommand.Prototype = function() {
  this.canEdit = function(annos, sel) { // eslint-disable-line
    return annos.length === 1;
  };

  this.executeCreate = function(props, context) {
    var annos = this._getAnnotationsForSelection(props, context);
    this._checkPrecondition(props, context, annos, this.canCreate);
    var newAnno = this._applyTransform(props, context, function(tx) {
      props.node.type = this.getAnnotationType();
      return createAnnotation(tx, props);
    }.bind(this));
    return {
      mode: 'edit',
      anno: newAnno
    };
  };

  this.getAnnotationType = function() {
    return 'entity';
  };
};

AnnotationCommand.extend(EntityCommand);

EntityCommand.static.name = 'entity';

module.exports = EntityCommand;
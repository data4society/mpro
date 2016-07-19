'use strict';

var AnnotationComponent = require('substance/ui/AnnotationComponent');

function EntityComponent() {
  EntityComponent.super.apply(this, arguments);
}

EntityComponent.Prototype = function() {

  this.getClassNames = function() {
    var entityClass = this.props.node.entityClass;
    var classNames = 'sc-'+this.props.node.type;

    if(entityClass) {
      classNames += ' sc-entity-' + entityClass;
    }

    return classNames;
  };

};

AnnotationComponent.extend(EntityComponent);

module.exports = EntityComponent;
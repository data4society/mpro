'use strict';

var Rubrics = require('./Rubrics');
var Rubric = require('./Rubric');
var RubricConverter = require('./RubricConverter');
var RubricsImporter = require('./RubricsImporter');

module.exports = {
  name: 'rubric',
  configure: function(config) {
    config.defineSchema({
      name: 'mpro-rubrics',
      ArticleClass: Rubrics,
      defaultTextType: 'paragraph'
    });

    config.addNode(Rubric);
    config.addConverter('rubrics', RubricConverter);
    config.addImporter('rubrics', RubricsImporter);
  }
};
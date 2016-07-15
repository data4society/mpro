'use strict';

var HTMLImporter = require('substance/model/HTMLImporter');
var each = require('lodash/each');
var converters = [];

function RubricsImporter(config) {
  RubricsImporter.super.call(this, config);
}

RubricsImporter.Prototype = function() {

  this.importDocument = function(rubricsData, facets) {
    this.reset();
    //this.convertDocument(articleEl);
    var doc = this.generateDocument();
    each(rubricsData, function(rubric) {
      var active = false;
      if(facets.indexOf(rubric.rubric_id) > -1) {
        active = true;
      }
      doc.create({
        id: rubric.rubric_id,
        type: 'rubric',
        name: rubric.name,
        count: rubric.cnt,
        description: rubric.description,
        parent: rubric.parent_id,
        active: active
      });
    });

    return doc;
  };

  /*
    Takes an HTML string.
  */
  this.convertDocument = function(bodyEls) {
    // Just to make sure we always get an array of elements
    if (!bodyEls.length) bodyEls = [bodyEls];
    this.convertContainer(bodyEls, 'body');
  };
};

HTMLImporter.extend(RubricsImporter);

RubricsImporter.converters = converters;

module.exports = RubricsImporter;
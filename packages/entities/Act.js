'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Act() {
  Act.super.apply(this, arguments);
}

Act.Prototype = function() {
  // Get entity name
  this.getName = function() {
    return this.article + ' ' + this.code;
  };
};

DocumentNode.extend(Act);

Act.static.name = 'norm_act';

/*
  Entities Act node.
  Holds Act entity.
  
  Attributes
    - code Code name
    - article Number of article
    - content Content of article
    - parent Parent article
*/

Act.static.defineSchema({
  code: { type: 'string', default: '', field: { type: "select", options: ['УК', 'КоАП'], placeholder: "Pick a code" }},
  article: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter article number" }},
  parent: { type: 'string', default: '', field: { type: "reference", multiple: false, placeholder: "Enter parent article", restrictions: {"entity_class": "norm_act"}}},
  content: { type: 'string', default: '', field: { type: "prose", placeholder: "Enter article content" }}
});

module.exports = Act;
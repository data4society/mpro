'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Person() {
  Person.super.apply(this, arguments);
}

Person.Prototype = function() {
  // Get entity name
  this.getName = function() {
    return this.lastname + ' ' + this.firstname;
  };
};

DocumentNode.extend(Person);

Person.static.name = 'person';

/*
  Entities Person node.
  Holds Person entity.
  
  Attributes
    - lastname Person lastname
    - firstname Person firstname
    - middlename Person middlename
    - nickname Person nickname
    - status Person status
    - position Person position in organization
    - role Person role
*/

Person.static.defineSchema({
  lastname: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter person's last name" }},
  firstname: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter person's first name" }},
  middlename: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter person's middle name" }},
  nickname: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter person's nick name" }},
  status: { type: 'string', default: '', field: { type: "select", options: ['пострадавший', 'хелпер', 'актор преследования'], placeholder: "Pick person's status" }},
  position: { type: ['string'], default: [], field: { type: "multiple", placeholder: "Enter person's position in organization" }},
  role: { type: ['string'], default: [], field: { type: "multiple", placeholder: "Enter person's role" }},
});

module.exports = Person;
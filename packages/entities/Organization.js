'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Organization() {
  Organization.super.apply(this, arguments);
}

DocumentNode.extend(Organization);

Organization.static.name = 'org';

/*
  Entities Organization node.
  Holds Organization entity.
  
  Attributes
    - name Organization name
    - jurisdiction Parent organizations
    - location Locations of organization
*/

Organization.static.defineSchema({
  name: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter organization name" }},
  jurisdiction: { type: ['string'], default: [], field: { type: "reference", multiple: true, placeholder: "Enter parent organizations", restrictions: {"entity_class": "org"}}},
  location: { type: ['string'], default: [], field: { type: "reference", multiple: true, placeholder: "Enter organization locations", restrictions: {"entity_class": "loc"}}}
});

module.exports = Organization;
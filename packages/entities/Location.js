'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function Location() {
  Location.super.apply(this, arguments);
}

DocumentNode.extend(Location);

Location.static.name = 'loc';

/*
  Entities Location node.
  Holds Location entity.
  
  Attributes
    - name Name name of location
    - loc_type Type type of location
*/

Location.static.defineSchema({
  name: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter location name" }},
  loc_type: { type: 'string', default: '', field: { type: "select", options: ['страна', 'регион', 'населенный пункт', 'точный адрес', 'объект с адресом'], placeholder: "Pick a location type" }}
});

module.exports = Location;
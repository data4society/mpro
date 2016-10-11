import { DocumentNode } from 'substance'

class Location extends DocumentNode {
  // Get entity name
  getName() {
    return this.name
  }
}

Location.type = 'location'

/*
  Entities Location node.
  Holds Location entity.
  
  Attributes
    - name Name name of location
    - loc_type Type type of location
*/

Location.define({
  name: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter location name" }},
  loc_type: { type: 'string', default: '', field: { type: "select", options: ['страна', 'регион', 'населенный пункт', 'точный адрес', 'объект с адресом'], placeholder: "Pick a location type" }}
})

export default Location

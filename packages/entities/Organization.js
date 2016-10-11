import { DocumentNode } from 'substance'

class Organization extends DocumentNode {
  // Get entity name
  getName() {
    return this.name
  }
}

Organization.type = 'org'

/*
  Entities Organization node.
  Holds Organization entity.
  
  Attributes
    - name Organization name
    - jurisdiction Parent organizations
    - location Locations of organization
*/

Organization.define({
  name: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter organization name" }},
  jurisdiction: { type: ['string'], default: [], field: { type: "reference", multiple: true, placeholder: "Enter parent organizations", restrictions: {"entity_class": "org"}}},
  location: { type: ['string'], default: [], field: { type: "reference", multiple: true, placeholder: "Enter organization locations", restrictions: {"entity_class": "location"}}}
})

export default Organization

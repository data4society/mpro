import { Component } from 'substance'
import each from 'lodash/each'

class Form extends Component {
  constructor(...args) {
    super(...args)

    this.node = this.getNode()
    this.schema = this.getSchema()
    this.fields = {}
  }


  prepare($$) {
    let self = this;
    each(this.schema, function(prop, id) {
      if(prop.field) {
        let config = prop.field
        let value = self.node[id]
        self.fields[id] = self.createField($$, id, config, value)
      }
    })
  }

  getNode() {
    return this.props.node
  }

  getSchema() {
    let schema = this.node.constructor.static.schema
    if (schema) {
      return schema
    } else {
      throw new Error('Contract: Node.static.schema must have a value')
    }
  }

  getField(type) {
    let field = this.constructor.static.fields[type]
    if(field) {
      return field
    } else {
      throw new Error('No constructor for field type: ' + type)
    }
  }

  createField($$, id, config, value) {
    let fieldType = config.type
    let Field = this.getField(fieldType)
    let el = $$(Field, {id: id, config: config, value: value, form: this})
    return el
  }

  render($$) {
    this.prepare($$)

    let el = $$('div')
      .addClass('sc-form')

    each(this.fields, function(field) {
      el.append(field)
    })

    return el
  }
}

Form.fields = {
  text: require('./Text'),
  checkbox: require('./Checkbox'),
  select: require('./Select'),
  date: require('./Date'),
  radio: require('./Radio'),
  checkboxes: require('./Checkboxes'),
  prose: require('./Prose'),
  toggle: require('./Toggle'),
  multiple: require('./Multiple'),
  reference: require('./Reference')
}

export default Form

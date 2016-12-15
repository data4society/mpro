import { Component } from 'substance'
import each from 'lodash/each'
import isEmpty from 'lodash/isEmpty'
import isNull from 'lodash/isNull'

class SelectFilter extends Component {

  render($$) {
    let placeholder = this.props.placeholder
    let options = this.props.options
    let filter = this.props.filter
    let value = filter ? filter.value : ''

    let el = $$('div').addClass('sc-select-filter')

    let select = $$('select')
      .ref('select')
      .on('change', this.onQuery)

    let defaultOption = $$('option')
        .attr({value: ''})
        .append(placeholder)

    if(isEmpty(value)) defaultOption.attr({selected: 'selected'})

    select.append(defaultOption)

    each(options, function(option) {
      if(!isNull(option) && !isEmpty(option)) {
        let optionEl = $$('option')
          .attr({value: option.toString()})
          .append(option.toString())

        if(value === option) optionEl.attr({selected: 'selected'})

        select.append(optionEl)
      }
    })

    el.append(select)

    return el
  }

  onQuery(e) {
    e.preventDefault()
    let property = this.props.name
    let op = this.props.op
    let value = this.refs.select.val()
    let filter = {
      name: property,
      op: op,
      value: value
    }
    this.send('filterList', property, filter)
  }

}

export default SelectFilter

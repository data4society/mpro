import { Component } from 'substance'
import isEmpty from 'lodash/isEmpty'

class InputFilter extends Component {
 
  getInitialState() {
    let filter = this.props.filter
    return {
      value: filter ? filter.value : ''
    }
  }

  render($$) {
    let type = this.props.type || 'text'
    let placeholder = this.props.placeholder
    let value = this.state.value

    let el = $$('div').addClass('sc-input-filter')

    let input = $$('input')
      .attr({type: type, placeholder: placeholder, value: value})
      .ref('input')
      .on('change', this.onQuery)
      .on('keyup', this.onKeyUp)

    if(isEmpty(value)) {
      el.append($$('span').addClass('search').append(' '))
    } else {
      el.append(
        $$('span').addClass('clear').append('×')
          .on('click', this.clear)
      )
    }

    el.append(input)

    return el
  }

  onQuery(e) {
    e.preventDefault()
    this.query()
  }

  onKeyUp(e) {
    e.preventDefault()
    let value = this.refs.input.val()
    if(!isEmpty(value) && isEmpty(this.state.value) || isEmpty(value) && !isEmpty(this.state.value)) {
      this.extendState({
        value: value
      })
    }
  }

  clear(e) {
    e.preventDefault()
    this.extendState({
      value: ''
    })
    this.query()
  }

  query() {
    let property = this.props.name
    let multi = this.props.multi
    let op = this.props.op
    let value = this.refs.input.val()
    let filter = {
      name: property,
      multi: multi,
      op: op,
      value: value
    }
    this.send('filterList', property, filter)
  }
}

export default InputFilter

import { Component } from 'substance'
import InputFilter from './InputFilter'

class Filters extends Component {

  getInitialState() {
    return {
      selects: [],
      filterOptions: {}
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-filters')

    let quick_find = $$('div').addClass('se-quick-find').append(
      $$(InputFilter, {name: 'name', op: '~~*', type: 'text', placeholder: 'Enter resource name', filter: this.props.name})
    )

    el.append(
      quick_find
    )

    return el
  }
}

export default Filters

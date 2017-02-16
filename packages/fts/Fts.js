import { Component } from 'substance'
import isEmpty from 'lodash/isEmpty'

class Fts extends Component {

  render($$) {
    let el = $$('div').addClass('sc-fts-filter')

    el.append(
      $$('input').attr({type: 'text', placeholder: this.getLabel('fts-label'), value: this.props.value})
        .ref('value')
        .on('keyup', this.onKeyUp)
    )

    if(isEmpty(this.props.value)) {
      el.append(
        this.context.iconProvider.renderIcon($$, 'search')
          .on('click', this.search)
      )
    } else {
      el.append(
        this.context.iconProvider.renderIcon($$, 'reset-search')
          .on('click', this.resetSearch)
      )
    }

    return el
  }

  onKeyUp(e) {
    let key = e.keyCode || e.which
    if(key === 13) {
      this.search()
    }
  }

  search() {
    let value = this.refs.value.val()
    this.send('toggleFtsFilter', value)
  }

  resetSearch() {
    this.send('toggleFtsFilter', '')
  }
}

export default Fts

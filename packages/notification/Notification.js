import { Component } from 'substance'
import isUndefined from 'lodash/isUndefined'

class Notification extends Component {
  
  render($$) {
    if(isUndefined(this.props.type)) {
      let emptyEl = $$('div').addClass('sc-empty-notification')
      return emptyEl
    }

    let el = $$('div').addClass('sc-notification se-type-' + this.props.type)
    el.append(this.props.message)
    return el
  }
}

export default Notification

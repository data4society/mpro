import { Component } from 'substance'
import each from 'lodash/each'

class Header extends Component {

  render($$) {
    let el = $$('div').addClass('sc-header')
    let actionEls = []

    if (this.props.actions) {
      each(this.props.actions, function(label, actionName) {
        actionEls.push(
          $$('button').addClass('se-action')
            .append(label)
            .on('click', this.send.bind(this, actionName))
        )
      }.bind(this))
    }

    let content = []
    if (this.props.content) {
      content = content.concat(this.props.content)
    }

    el.append(
      $$('div').addClass('se-actions').append(actionEls),
      $$('div').addClass('se-content').append(content)
    )
    return el
  }
}

export default Header

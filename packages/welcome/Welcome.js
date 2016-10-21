import { Component, Layout } from 'substance'
import RequestLogin from './RequestLogin'

class Welcome extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loginRequested': this._loginRequested
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-welcome')

    // Topbar with branding
    el.append(
      $$('div').addClass('se-topbar').html('')
    )

    let layout = $$(Layout, {
      width: 'medium',
      textAlign: 'center'
    })

    layout.append(
      $$(RequestLogin)
    )

    el.append(layout);
    return el
  }

  _loginRequested() {
    this.setState({requested: true})
  }
}

export default Welcome

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
    let picture = Math.floor(Math.random() * 5) + 1  
    let el = $$('div').addClass('sc-welcome').attr({
      style: "background-image: -webkit-gradient(linear, left top, right top, from(rgba(72, 85, 99,0.5)), to(rgba(41, 50, 60,.25))), url('/assets/" + picture + ".jpg');"
    })
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

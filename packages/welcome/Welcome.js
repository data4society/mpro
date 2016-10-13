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

    if (this.state.requested) {
      layout.append(
        $$('h1').append(this.getLabel('welcome-title')),
        $$('p').append(this.getLabel('welcome-instructions'))
      )
    } else {
      layout.append(
        $$('h1').append(
          this.getLabel('welcome-title'),
          $$('span').addClass('se-cursor')
        ),
        $$('p').append(this.getLabel('welcome-about')),
        $$('h2').append(this.getLabel('welcome-no-passwords')),
        $$('p').html(this.getLabel('welcome-howto-login')),
        $$('p').append(this.getLabel('welcome-enter-email'))
      )

      layout.append(
        $$(RequestLogin)
      )
    }

    el.append(layout)
    return el
  }

  _loginRequested() {
    this.setState({requested: true})
  }
}

export default Welcome

import { Component } from 'substance'

class LoginStatus extends Component {

  render($$) {
    let authenticationClient = this.context.authenticationClient
    let user = authenticationClient.getUser()
    let el = $$('div').addClass('sc-login-status')

    if(user) {
      let name = user.name || 'Anonymous'
      //let el = $$('div').addClass('sc-login-status');
      el.append(
        name,
        $$('span').addClass('se-caret fa fa-caret-down')
      )
      el.append($$('ul').append(
        $$('li').on('click', this._openUserSettings).append('Settings'),
        $$('li').on('click', this._logout).append('Logout')
      ))
    }
    return el
  }

  _logout() {
    this.send('logout')
  }

  _openUserSettings() {
    this.send('settings')
  }
}

export default LoginStatus

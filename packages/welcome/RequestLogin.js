import { Component, Button, Input } from 'substance'

class RequestLogin extends Component {

  render($$) {
    let Notification = this.getComponent('notification')
    let el = $$('div').addClass('sc-request-login')

    el.append(
      $$('div').addClass('se-email').append(
        $$(Input, {
          type: 'email',
          value: this.state.email,
          placeholder: this.getLabel('enter-email-placeholder'),
          centered: true
        }).ref('email')
      ),
      $$('div').addClass('se-password').append(
        $$(Input, {
          type: 'password',
          placeholder: this.getLabel('enter-password-placeholder'),
          centered: true
        }).ref('password')
      )
    )

    el.append(
      $$(Button, {
        disabled: Boolean(this.state.loading), // disable button when in loading state
        label: 'login'
      }).on('click', this._login)
    )

    if (this.state.notification) {
      el.append($$(Notification, this.state.notification))
    }

    return el
  }

  _login() {
    let email = this.refs.email.val()
    let password = this.refs.password.val()
    let authenticationClient = this.context.authenticationClient

    // Set loading state
    this.setState({
      email: email,
      loading: true
    })

    authenticationClient.authenticate({
      email: email,
      password: password
    }, function(err, session) {
      if (err) {
        this.setState({
          loading: false,
          notification: {
            type: 'error',
            message: 'Sorry. Make sure you provided a valid email and password.'
          }
        });
      } else {
        window.localStorage.setItem('sessionToken', session.sessionToken)
        this.send('home')
      }
    }.bind(this))
  }

  _requestLoginLink() {
    let email = this.refs.email.val()
    let authenticationClient = this.context.authenticationClient

    // Set loading state
    this.setState({
      email: email,
      loading: true
    })

    authenticationClient.requestLoginLink({
      email: email,
      documentId: this.props.documentId
    }, function(err) {
      if (err) {
        this.setState({
          loading: false,
          notification: {
            type: 'error',
            message: 'Your request could not be processed. Make sure you provided a valid email.'
          }
        })
      } else {
        this.setState({
          loading: false,
          requested: true
        })
        this.send('loginRequested');
      }
    }.bind(this))
  }
}

export default RequestLogin

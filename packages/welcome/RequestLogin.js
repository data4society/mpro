import { Button, Component, Input } from 'substance'

class RequestLogin extends Component {

  render($$) {
    let Notification = this.getComponent('notification')

    let el = $$('div').addClass('sc-request-login')

    if (this.state.requested) {
      el.append(
        $$('h1').append(this.i18n.t('sc-welcome.submitted-title')),
        $$('p').append(this.i18n.t('sc-welcome.submitted-instructions'))
      )
    } else {
      el.append(
        $$('div').addClass('se-email').append(
          $$(Input, {
            type: 'text',
            value: this.state.email,
            placeholder: 'Enter your email here',
            centered: true
          }).ref('email')
        )
      )

      el.append(
        $$(Button, {
          disabled: Boolean(this.state.loading) // disable button when in loading state
        }).append(this.getLabel('welcome-submit'))
          .on('click', this._requestLoginLink)
      )

      if (this.state.notification) {
        el.append($$(Notification, this.state.notification))
      }
    }
    return el
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
        this.send('loginRequested')
      }
    }.bind(this))
  }
}

export default RequestLogin

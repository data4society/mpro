import { Component, Input, Button, Layout } from 'substance'

class EnterName extends Component {

  render($$) {
    let Notification = this.getComponent('notification')
    let el = $$('div').addClass('sc-enter-name')
    let userName = this.props.userSession.user.name

    let header = this.renderHeader($$)

    let form = $$(Layout, {
      width: 'medium',
      textAlign: 'center'
    })

    // If no username present yet
    if (!userName) {
      form.append(
        $$('h1').append(
          this.getLabel('welcome')
        )
      )
    } else {
      form.append(
        $$('h1').append(
          this.getLabel('enter-name')
        )
      )
    }

    if (this.state.notification) {
      form.append($$(Notification, this.state.notification))
    }

    form.append(
      $$('div').addClass('se-enter-name').append(
        $$(Input, {
          type: 'text',
          value: userName || '',
          placeholder: this.getLabel('enter-name-placeholder'),
          centered: true
        }).ref('name')
      ),
      $$('p').addClass('se-help').append(
        this.getLabel('enter-name-help')
      )
    )

    form.append(
      $$(Button, {
        disabled: Boolean(this.state.loading), // disable button when in loading state
        label: 'continue',
        icon: 'continue',
        style: 'default'
      })
      .on('click', this._updateUserName)
    )

    el.append(
      header,
      form
    )
    return el
  }

  renderHeader($$) {
    let Header = this.getComponent('header')
    let header = $$(Header, {
      actions: {
        'inbox': this.getLabel('inbox-menu'),
        'configurator': this.getLabel('configurator-menu'),
        'import': this.getLabel('import-menu'),
        'users': this.getLabel('configurator-users')
      }
    })

    return header
  }

  _updateUserName() {
    let name = this.refs.name.val()
    let authenticationClient = this.context.authenticationClient
    let userSession = this.props.userSession

    if (!name) {
      this.setState({
        notification: {
          type: 'error',
          message: 'Please provide a name.'
        }
      })
    }

    authenticationClient.changeName(userSession.user.user_id, name, function(err) {
      if(err) {
        this.setState({
          notification: {
            type: 'error',
            message: this.getLabel(err.name)
          }
        })
        return
      }

      userSession.user.name = name
      this.send('userSessionUpdated', userSession)
    }.bind(this))
  }
}

export default EnterName

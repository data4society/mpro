import { Component, Button, Input } from 'substance'

class UserForm extends Component {

  render($$) {
    let el = $$('div').addClass('sc-user-form')

    let emailInput = $$('div').addClass('se-email').append(
      $$(Input, {
        type: 'email',
        placeholder: 'Введите email',
        centered: true
      }).ref('email')
    )

    if(this.state.error) {
      emailInput.append('Пожалуйста введите корректный адрес')
    }

    let accessInput = $$('label').addClass('se-access').append(
      $$(Input, {
        type: 'checkbox'
      }).ref('access'),
      'открыть доступ'
    )

    let superInput = $$('label').addClass('se-super').append(
      $$(Input, {
        type: 'checkbox'
      }).ref('super'),
      'открыть админ доступ'
    )

    let actions = $$('div').addClass('se-actions').append(
      $$(Button).addClass('se-invite-user')
        .on('click', this._createUser)
        .append('Пригласить'),
      $$(Button).addClass('se-cancel')
        .on('click', this.send.bind(this, 'closeModal'))
        .append('Отмена')
    )

    el.append(
      emailInput,
      accessInput,
      superInput,
      actions
    )

    return el
  }

  _createUser() {
    let newUser = {
      email: this.refs.email.val()
    }

    newUser.access = this.refs.access.el.el.checked;
    newUser.super = this.refs.super.el.el.checked;

    let emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (emailRegExp.test(newUser.email)) {
      this.send('addUser', newUser);
    } else {
      this.setState({'error': true});
    }
  }
}

export default UserForm
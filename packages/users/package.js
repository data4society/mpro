import Users from './Users'

export default {
  name: 'users',
  configure: function(config) {
    config.addPage('users', Users)

    config.addLabel('configurator-users', {
      en: 'Users',
      ru: 'Пользователи'
    })
  }
}

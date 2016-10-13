import Notification from './Notification'

export default {
  name: 'notification',
  configure: function(config) {
    config.addComponent('notification', Notification)
  }
}

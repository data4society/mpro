import { Component, Button, Grid, Modal, SubstanceError as Err } from 'substance'
import concat from 'lodash/concat'
import moment from 'moment'
import UserForm from './UserForm'

class UsersList extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore,
      'toggleAccess': this._toggleAccess,
      'addUser': this._createUser,
      'closeModal': this._hideUserDialog
    })
  }

  didMount() {
    this._loadUsers()
  }

  willReceiveProps() {
    this._loadUsers()
  }

  getInitialState() {
    return {
      filters: {},
      search: null,
      dialog: false,
      perPage: 30,
      page: 1,
      order: 'user_id',
      direction: 'desc',
      userItems: []
    }
  }

  render($$) {
    let userItems = this.state.userItems
    let el = $$('div').addClass('sc-list')

    if (!userItems) {
      return el
    }

    el.append(this.renderIntro($$))

    if (userItems.length > 0) {
      el.append(this.renderFull($$))
    } else {
      el.append(this.renderEmpty($$))
    }
    return el
  }

  renderIntro($$) {
    let totalItems = this.state.totalItems
    let el = $$('div').addClass('se-intro no-filters')

    el.append(
      $$('div').addClass('se-items-count').append(
        $$('strong').append(totalItems),
        ' users found'
      ),
      $$(Button).addClass('se-add-user')
        .on('click', this._showUserDialog)
        .append('Добавить пользователя')
    )

    if (this.state.dialog) {
      el.append(
        $$(Modal, {
          width: 'middle'
        }).addClass('se-user-form-modal').append(
          $$(UserForm).ref('user-form')
        )
      )
    }

    return el
  }

  renderEmpty($$) {
    let el = $$('div').addClass('se-list-empty')

    el.append(
      $$('h1').html(
        'No results'
      ),
      $$('p').html('We have no users matching your query')
    )

    return el
  }

  renderFull($$) {
    let items = this.state.userItems
    let total = this.state.totalItems
    let Pager = this.getComponent('pager')
    let el = $$('div').addClass('se-list-not-empty')

    let grid = $$(Grid)

    if (items) {
      items.forEach(function(item) {
        let accessCheckboxIcon = item.access ? 'fa-check-square-o' : 'fa-square-o'
        let accessCheckbox = $$('div').addClass('se-access').append(
          'доступ',
          $$('i').addClass('fa ' + accessCheckboxIcon)
        ).on('click', this._toggleAccess.bind(this, item.user_id, 'access'))

        let superCheckboxIcon = item.super ? 'fa-check-square-o' : 'fa-square-o'
        let superCheckbox = $$('div').addClass('se-super').append(
          'админ',
          $$('i').addClass('fa ' + superCheckboxIcon)
        ).on('click', this._toggleAccess.bind(this, item.user_id, 'super'))

        let created = moment(item.created).format("DD.MM.YYYY HH:mm")
        
        grid.append(
          $$(Grid.Row, {user: item}).ref(item.user_id).append(
            $$(Grid.Cell, {columns: 2}).append('#'+item.user_id),
            $$(Grid.Cell, {columns: 3}).append(item.email),
            $$(Grid.Cell, {columns: 3}).append(item.name || 'Anonymous'),
            $$(Grid.Cell, {columns: 2}).append(created),
            $$(Grid.Cell, {columns: 1}).append(accessCheckbox),
            $$(Grid.Cell, {columns: 1}).append(superCheckbox)
          ).ref(item.user_id)
        )
      }.bind(this))

      el.append(
        grid,
        $$(Pager, {total: total, loaded: items.length})
      )
    }
    return el
  }

  _showUserDialog() {
    this.extendState({'dialog': true})
  }

  _hideUserDialog() {
    this.extendState({'dialog': false})
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadUsers()
  }

  _toggleAccess(userId, prop) {
    let documentClient = this.context.documentClient
    let user = this.refs[userId].props.user
    let update = {}
    update[prop] = !user[prop];
    documentClient.updateUser(userId, update, function(err, result) {
      if (err) {
        this.setState({
          error: new Err('UserList.UpdateError', {
            message: 'User could not be updated.',
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }

      //this.refs[userId].extendProps({user: result})
      this._loadUsers()
    }.bind(this))
  }

  _createUser(data) {
    let documentClient = this.context.documentClient
    documentClient.createUser(data, function(err, user) {
      if (err) {
        this.setState({
          error: new Err('UserList.CreateError', {
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }
      let users = this.state.userItems
      users.unshift(user)
      this.extendState({userItems: users, 'dialog': false})
    }.bind(this))
  }

  /*
    Loads users
  */
  _loadUsers() {
    let self = this
    let documentClient = this.context.documentClient
    let filters = this.state.filters
    let perPage = this.state.perPage
    let page = this.state.page
    let pagination = this.state.pagination
    let order = this.state.order
    let direction = this.state.direction
    let items= []
    //var userId = this._getUserId();

    documentClient.listUsers(filters,
      {
        limit: perPage, 
        offset: this.state.userItems.length,
        order: order + ' ' + direction
      }, function(err, results) {
        if (err) {
          this.setState({
            error: new Err('UserList.LoadingError', {
              message: 'Users could not be loaded.',
              cause: err
            })
          });
          console.error('ERROR', err)
          return
        }

        if(pagination) {
          items = concat(this.state.userItems, results.records)
        } else {
          items = results.records
        }

        self.extendState({
          userItems: items,
          totalItems: results.total
        });
      }.bind(this))
  }
}

export default UsersList

import { Component } from 'substance'
import each from 'lodash/each'

class Collaborators extends Component {

  didMount() {
    this._init()
  }

  willReceiveProps() {
    this.dispose()
    this._init()
  }

  _init() {
    if(this.props.session) {
      this.props.session.on('collaborators:changed', this.rerender, this)
    }
  }

  dispose() {
    if(this.props.session) {
      this.props.session.off(this)
    }
  }

  render($$) {
    if(!this.props.session) {
      let emptyEl = $$('div').addClass('sc-empty-collaborators')
      return emptyEl
    }
   
    let el = $$('div').addClass('sc-collaborators')

    let collaborators = this.props.session.collaborators
    each(collaborators, function(collaborator) {
      let initials = this._extractInitials(collaborator)
      el.append(
        $$('div').addClass('se-collaborator sm-collaborator-'+collaborator.colorIndex).attr({title: collaborator.name || 'Anonymous'}).append(
          initials
        )
      )
    }.bind(this))
    return el
  }

  _extractInitials(collaborator) {
    let name = collaborator.name
    if (!name) {
      return 'A'
    }
    let parts = name.split(' ')
    return parts.map(function(part) {
      return part[0].toUpperCase() // only use the first letter of a part
    })
  }
}

export default Collaborators

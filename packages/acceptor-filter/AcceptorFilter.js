import { Button, Component } from 'substance'

class AcceptorFilter extends Component {
  getInitialState() {
    return {
      accepted: this.props.accepted === undefined ? null : this.props.accepted,
      moderated: this.props.moderated === undefined ? null : this.props.moderated,
      negative: this.props.negative === undefined ? null : this.props.negative
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-facets sc-accept-filters')

    el.append(
      $$('div').addClass('se-tree-node se-tree-title').append(
        $$('span').addClass('se-tree-node-name').append('Accepted documents')
      )
    )

    let acceptor = $$('div').addClass('se-filter-acceptor').append(
      $$(Button, {style: 'outline', icon: 'acceptor'})
        .on('click', this._toggleValue.bind(this, 'accepted'))
    )

    if(this.state.accepted === true) {
      acceptor.addClass('sm-on')
    } else if (this.state.accepted === false) {
      acceptor.addClass('sm-off')
    }

    let moderator = $$('div').addClass('se-filter-acceptor').append(
      $$(Button, {style: 'outline', icon: 'moderator'})
        .on('click', this._toggleValue.bind(this, 'moderated'))
    )

    if(this.state.moderated === true) {
      moderator.addClass('sm-on')
    } else if (this.state.moderated === false) {
      moderator.addClass('sm-off')
    }

    let negative = $$('div').addClass('se-filter-acceptor').append(
      $$(Button, {style: 'outline', icon: 'negative'})
        .on('click', this._toggleValue.bind(this, 'negative'))
    )

    if(this.state.negative === true) {
      negative.addClass('sm-on')
    } else if (this.state.negative === false) {
      negative.addClass('sm-off')
    }

    el.append(
      acceptor,
      moderator,
      negative
    )

    return el
  }

  _toggleValue(prop) {
    let currentValue = this.state[prop]
    let value
    if(currentValue === null) {
      value = true
    } else if (currentValue === true) {
      value = false
    } else if (currentValue === false) {
      value = null
    }
    let state = {}
    state[prop] = value

    this._toggleFilter(prop, value)

    this.extendState(state)
  }

  _toggleFilter(prop, value) {
    this.send('toggleDataFilter', prop, value)
  }
}

export default AcceptorFilter

import { Button, Component } from 'substance'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import each from 'lodash/each'
import map from 'lodash/map'

class EntitySelector extends Component {

  didMount() {
    let props = this.props
    let selected = []
    props.entities.forEach(function(item, id) {
      selected.push({
        id: item,
        name: props.entities_names[id]
      })
    })
    this.extendState({selected: selected})
  }

  getInitialState() {
    let state = {
      selected: [],
      dropdown: false,
      options: []
    }

    return state
  }

  getValue() {
    let selected = this.state.selected
    let output = {
      id: [],
      names: []
    }
    selected.forEach(function(item) {
      output.id.push(item.id)
      output.names.push(item.name)
    })
    return output
  }
  
  render($$) {
    let el = $$('div').addClass('sc-modal sm-width-medium')
    let selectorEl = $$('div').addClass('se-body sc-entity-finder')
    
    let selected = this.state.selected
    
    if(!isEmpty(selected)) {
      let multipleWidget = $$('div').addClass('se-results')

      selected.forEach(function(item) {
        multipleWidget.append(
          $$('div').addClass('se-value').append(item.name)
            .attr('data-id', item.id)
            .on('click', this.removeValue)
        )
      }.bind(this))

      selectorEl.append(
        multipleWidget,
        $$(Button, {label: 'Done', style: 'default'}).addClass('se-button-done')
          .on('click', this._onClickDone)
      )
    }
    
    selectorEl.append(
      $$('input').attr({type: 'text', placeholder: this.getLabel('reference-select')})
        .ref('value')
        .on('keyup', this.onKeyUp)
        .on('blur', this.onBlur)
    )

    if(this.state.dropdown) {
      let options = this.state.options
      let ids = map(selected, 'id')
      let list = $$('ul').addClass('se-dropdown-list')
     
      if(options.length > 0) {
        each(options, function(option) {
          let item = $$('li').addClass('se-dropdown-item').append(option.name)
            .attr('data-id', option.id)

          if(ids.indexOf(option.id) > -1) {
            item.addClass('se-disabled-item')
          } else {
            item.on('click', this.addValue)
          }

          list.append(item)
        }.bind(this))
      } else {
        let item = $$('li').addClass('se-dropdown-item se-disabled-item')
          .append(this.getLabel('reference-empty-value'))
        list.append(item)
      }
      selectorEl.append(list);
    }

    selectorEl.append($$('div').addClass('help').append('Select entity from list'))

    el.on('click', this._closeModal)
    el.append(selectorEl)
    
    return el
  }

  prepareList(value) {
    let dataClient = this.context.documentClient
    let restrictions = { entity_class: this.props.entityClass }

    dataClient.findEntities(value, restrictions, function(err, res) {
      if (err) {
        console.error(err);
        return
      }

      let options = map(res, function(e) {return {id: e.entity_id, name: e.name}; })
      this.extendState({options: options, dropdown: true})
    }.bind(this))
  }

  onKeyUp() {
    //var key = e.keyCode || e.which;
    let value = this.refs.value.val()
    this.prepareList(value)
  }

  onBlur() {
    this.refs.value.val('')
    setTimeout(function() {
      this.extendState({dropdown: false})
    }.bind(this), 300)
  }

  addValue(e) {
    e.preventDefault()
    e.stopPropagation()
    let id = e.target.dataset.id
    let value = find(this.state.options, function(item) { return item.id === id; })
    let selected = this.state.selected
    selected.push(value)
    this.refs.value.val('')
    this.extendState({selected: selected, dropdown: false})
  }

  removeValue(e) {
    e.preventDefault()
    let el = e.target
    let highlighted = el.classList.contains('se-hihglight-remove')
    if(highlighted) {
      this.deleteValue(el.dataset.id)
    } else {
      each(el.parentElement.childNodes,function(node){
        node.className = 'se-value'
      })
      el.className += ' se-hihglight-remove'
    }
  }

  deleteValue(id) {
    let selected = this.state.selected
    let index = findIndex(this.state.selected, function(item) { return item.id === id; })
    if (index > -1) {
      selected.splice(index, 1)
    }
    this.extendState({selected: selected})
  }

  _onClickDone(e) {
    e.preventDefault()
    let selected = this.getValue()
    this.send('closeEntitySelector', selected)
  }

  _closeModal(e) {
    e.stopPropagation()
    let closeSurfaceClick = e.target.classList.contains('sc-modal')
    if (closeSurfaceClick) {
      let selected = this.getValue()
      this.send('closeEntitySelector', selected)
    }
  }
}

export default EntitySelector

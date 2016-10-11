import { Button, Component } from 'substance'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import each from 'lodash/each'
import map from 'lodash/map'

class EntityFinder extends Component {

  getInitialState() {
    let state = {
      selected: {},
      dropdown: false,
      options: []
    }

    return state
  }

  getValue() {
    return this.state.selected.id
  }
  
  render($$) {
    let el = $$('div').addClass('sc-entity-finder')
    
    let selected = this.state.selected
    
    if(!isEmpty(selected)) {
      let multipleWidget = $$('div').addClass('se-results')

      multipleWidget.append(
        $$('div').addClass('se-value').append(selected.name)
          .attr('data-id', selected.id)
          .on('click', this.removeValue)
      )

      el.append(
        multipleWidget,
        $$(Button).addClass('se-button-done').append('Done')
          .on('click', this._onClickDone)
      )
    } else {
      el.append(
        $$('input').attr({type: 'text', placeholder: this.getLabel('reference-select')})
          .ref('value')
          .on('keyup', this.onKeyUp)
          .on('blur', this.onBlur),
        $$(Button).addClass('se-button-create').append('+ Add')
          .on('click', this._createEntity)
      )
    }

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
      el.append(list);
    }

    el.append($$('div').addClass('help').append('Select entity from list'))
    
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
    this.refs.value.val('')
    this.extendState({selected: value, dropdown: false})
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

  deleteValue() {
    this.extendState({selected: {}})
  }

  _createEntity() {
    let dataClient = this.context.documentClient

    let entityData = {
      entity_class: this.props.entityClass
    }

    dataClient.createEntity(entityData, function(err, res) {
      if (err) {
        console.error(err)
        return
      }
      
      let reference = res.entity_id
      this.send('createReference', reference, true)
    }.bind(this))
  }

  _onClickDone(e) {
    e.preventDefault()
    this.send('createReference', this.getValue(), false)
  }
}

export default EntityFinder

import { Button, Component, Grid, uuid } from 'substance'
import EntitySelector from './EntitySelector'
import RubricSelector from './RubricSelector'
import isEmpty from 'lodash/isEmpty'

class CollectionsEditor extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'closeEntitySelector': this._onCloseEntitySelector,
      'closeRubricSelector': this._onCloseRubricSelector
    })
  }

  getInitialState() {
    return {
      rules: [],
      rubricEditor: false,
      entityEditor: false
    }
  }

  didMount() {
    this._loadCollectionRules()
  }

  render($$) {
    let el = $$('div').addClass('sc-rules-editor')

    let rules = this.state.rules

    if(this.state.rubricEditor !== false) {
      let activeRuleId = this.state.rubricEditor
      el.append(
        $$(RubricSelector, this.state.rules[activeRuleId]).ref('editor')
      )
    }

    if(this.state.entityEditor !== false) {
      let activeRuleId = this.state.entityEditor
      el.append(
        $$(EntitySelector, this.state.rules[activeRuleId]).ref('editor')
      )
    }

    let grid = $$(Grid)

    grid.append(
      $$(Grid.Row).append(
        $$(Grid.Cell, {columns: 5}).append($$('strong').append('rubrics')),
        $$(Grid.Cell, {columns: 5}).append($$('strong').append('entities')),
        $$(Grid.Cell, {columns: 2}).append(
          $$(Button, {label: 'add-rule', style: 'default', icon: 'rule-add'})
            .addClass('se-add-rule')
            .attr({title: this.getLabel('add-rule-description')})
            .on('click', this._createRule.bind(this))
        )
      ).ref('header')
    )

    rules.forEach(function(rule, id) {
      let rubrics = rule.rubrics_names.join(' && ')
      if(isEmpty(rubrics)) {
        rubrics = '+ Add rubrics set'
      } else {
        rubrics += ' \r\n + Add other rubrics'
      }
      let entities = rule.entities_names.join(' && ')
      if(isEmpty(entities)) {
        entities = '+ Add entities set'
      } else {
        entities += ' \r\n + Add other entities'
      }

      grid.append(
        $$(Grid.Row).append(
          $$(Grid.Cell, {columns: 5}).addClass('sm-sets').append(rubrics)
            .on('click', this._editRubrics.bind(this, id)),
          $$(Grid.Cell, {columns: 5}).addClass('sm-sets').append(entities)
            .on('click', this._editEntities.bind(this, id)),
          $$(Grid.Cell, {columns: 2}).append(
            $$(Button, {label: 'remove-rule', style: 'default', icon: 'rule-remove'})
              .addClass('se-rule-control')
              .attr({title: this.getLabel('remove-rule-description')})
              .on('click', this._removeRule.bind(this, id)),
            $$(Button, {label: 'reapply-rule', style: 'default', icon: 'rule-reapply'})
              .addClass('se-rule-control')
              .attr({title: this.getLabel('reapply-rule-description')})
              .on('click', this._reapplyRule.bind(this, id))
          )
        ).ref(rule.rule_id)
      )
    }.bind(this))

    el.append(grid)

    return el
  }

  _editRubrics(id) {
    this.extendState({rubricEditor: id})
  }

  _editEntities(id) {
    this.extendState({entityEditor: id})
  }

  _onCloseRubricSelector(rubrics) {
    let activeRuleId = this.state.rubricEditor
    let rules = this.state.rules
    rules[activeRuleId].rubrics = rubrics.id
    rules[activeRuleId].rubrics_names = rubrics.names
    this._updateRule(rules[activeRuleId].rule_id, {rubrics: rubrics.id}, function(err) {
      if (err) {
        console.error(err)
        return
      }

      this.extendState({rules: rules, rubricEditor: false})
    }.bind(this))
  }

  _onCloseEntitySelector(entities) {
    let activeRuleId = this.state.entityEditor
    let rules = this.state.rules
    rules[activeRuleId].entities = entities.id
    rules[activeRuleId].entities_names = entities.names
    this._updateRule(rules[activeRuleId].rule_id, {entities: entities.id}, function(err) {
      if (err) {
        console.error(err)
        return
      }

      this.extendState({rules: rules, entityEditor: false})
    }.bind(this))
  }

  _createRule() {
    let dataClient = this.context.documentClient
    let rule = {
      rule_id: uuid(),
      collection_id: this.props.collectionId,
      rubrics: [],
      entities: [],
      app_id: this.props.app
    }
    dataClient.createRule(rule, function(err) {
      if (err) {
        console.error(err)
        return
      }

      rule.entities_names = []
      rule.rubrics_names = []

      let rules = this.state.rules
      rules.unshift(rule)
      this.extendState({rules: rules})
    }.bind(this))
  }

  _updateRule(id, data, cb) {
    let dataClient = this.context.documentClient
    dataClient.updateRule(id, data, cb)
  }

  _removeRule(id) {
    let dataClient = this.context.documentClient
    let ruleId = this.state.rules[id].rule_id
    dataClient.removeRule(ruleId, function(err) {
      if (err) {
        console.error(err)
        return
      }

      let rules = this.state.rules
      rules.splice(id, 1)
      this.extendState({rules: rules})
    }.bind(this))
  }

  _reapplyRule(id) {
    let dataClient = this.context.documentClient
    let ruleId = this.state.rules[id].rule_id
    dataClient.reapplyRule(ruleId, function(err) {
      if (err) {
        console.error(err)
        return
      }
    })
  }

  _loadCollectionRules() {
    let collectionId = this.props.collectionId
    let dataClient = this.context.documentClient
    
    dataClient.listRules(
      {'collection_id': collectionId},
      {}, 
      function(err, rules) {
        if (err) {
          console.error(err)
          return
        }

        this.extendState({rules: rules.records})
      }.bind(this)
    )
  }
}

export default CollectionsEditor

import { Component, Grid, uuid } from 'substance'
import EntitySelector from './EntitySelector'
import RubricSelector from './RubricSelector'

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
          this.context.iconProvider.renderIcon($$, 'collection-add'),
          $$('span').append(' Add rule')
        ).on('click', this._createRule.bind(this))
      ).ref('header')
    )

    rules.forEach(function(rule, id) {    
      grid.append(
        $$(Grid.Row).append(
          $$(Grid.Cell, {columns: 5}).append(rule.rubrics_names.join(' && '))
            .on('click', this._editRubrics.bind(this, id)),
          $$(Grid.Cell, {columns: 5}).append(rule.entities_names.join(' && '))
            .on('click', this._editEntities.bind(this, id)),
          $$(Grid.Cell, {columns: 1}).append(this.context.iconProvider.renderIcon($$, 'rule-remove'))
            .on('click', this._removeRule.bind(this, id)),
          $$(Grid.Cell, {columns: 1}).append(this.context.iconProvider.renderIcon($$, 'rule-reapply'))
            .on('click', this._reapplyRule.bind(this, id))
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
      entities: []
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

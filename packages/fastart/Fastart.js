import { Component, SplitPane } from 'substance'

class Fastart extends Component {

  didMount() {
    this._loadActiveRubrics()
    this._loadLearningRubrics()
    if(this.state.rubric) {
      this._loadRubric(this.state.rubric)
    }
  }

  getInitialState() {
    return {
      filters: {},
      learningRubrics: [],
      activeRubrics: [],
      rubric: this.props.rubric
    }
  }

  render($$) {
    let Header = this.getComponent('header')
    let el = $$('div').addClass('sc-fastart')

    el.append(
      $$(Header, this.props),
      $$(SplitPane, {splitType: 'vertical', sizeA: '300px'}).append(
        this._renderRubricsList($$),
        this._renderRubric($$)
      )
    )

    return el
  }

  _renderRubricsList($$) {
    let el = $$('div').addClass('se-rubrics-list')

    let learningRubrics = this.state.learningRubrics
    let activeRubrics = this.state.activeRubrics

    let learningRubricsTitle = $$('div').addClass('se-tree-node se-tree-title').append(
      $$('span').addClass('se-tree-node-name').append('Learning Rubrics')
    )
    el.append(learningRubricsTitle)
    learningRubrics.forEach(rubric => {
      el.append(
        $$('div').addClass('se-tree-node').append(
          $$('span').addClass('se-tree-node-name').append(rubric.name),
          $$('span').addClass('se-tree-node-status se-status-' + rubric.status.toLowerCase())
            .append(rubric.status.toLowerCase())
        ).on('click', this._openRubric.bind(this, rubric.rubric_id))
      )
    })

    let activeRubricsTitle = $$('div').addClass('se-tree-node se-tree-title').append(
      $$('span').addClass('se-tree-node-name').append('Active Rubrics')
    )
    el.append(activeRubricsTitle)
    activeRubrics.forEach(rubric => {
      el.append(
        $$('div').addClass('se-tree-node').append(
          $$('span').addClass('se-tree-node-name').append(rubric.name)
        ).on('click', this._openRubric.bind(this, rubric.rubric_id))
      )
    })

    return el
  }

  _renderRubric($$) {
    let el = $$('div').addClass('se-rubric')
    let rubric = this.state.rubric
    let data = this.state.rubricData
    let type = this.state.rubricType

    el.append('test')

    if(!rubric) {
      el.append('Click on rubric')
    } else {
      if(!type) {
        el.append('Loading...')
      } else {
        if(type === 'active') {
          el.append('Active rubric')
        } else if (type === 'learning') {
          el.append('Learning rubric')
        }
      }
    }

    return el
  }

  _openRubric(id) {
    this._loadRubric(id)
  }

  _loadRubric(id) {
    this._loadActiveRubric(id, (err, activeRubric) => {
      if(err) {
        console.error(err)
        return
      }
      if(activeRubric) {
        this.extendState({rubricData: activeRubric, rubricType: 'active'})
      } else {
        this._loadLearningRubric(id, (err, learningRubric) => {
          if(err) {
            console.error(err)
            return
          }
          this.extendState({rubricData: learningRubric, rubricType: 'learning'})
        })
      }
    })
  }

  _loadActiveRubric(id, cb) {
    let documentClient = this.context.documentClient
    documentClient.getRubric(id, cb)
  }

  _loadLearningRubric(id, cb) {
    let fastartClient = this.context.fastartClient
    fastartClient.listRubrics(id, cb)
  }

  _loadActiveRubrics() {
    let filters = this.state.filters
    let documentClient = this.context.documentClient
    documentClient.listRubrics(filters, {limit: 100, order: "name asc"}, (err, result) => {
      if (err) {
        console.error(err)
        return
      }

      this.extendState({
        activeRubrics: result
      })
    })
  }

  _loadLearningRubrics() {
    let fastartClient = this.context.fastartClient
    fastartClient.listRubrics((err, result) => {
      if (err) {
        console.error(err)
        return
      }

      if(result.status === 'OK') {
        this.extendState({
          learningRubrics: result.response
        })
      }
    })
  }
}

export default Fastart

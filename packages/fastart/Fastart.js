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

  willUpdateState(newState) {
    if(this.state.rubric !== newState.rubric) {
      this._loadRubric(newState.rubric)
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
      let node = $$('div').addClass('se-tree-node').append(
        $$('span').addClass('se-tree-node-name').append(rubric.name),
        $$('span').addClass('se-tree-node-status se-status-' + rubric.status.toLowerCase())
          .append(rubric.status.toLowerCase())
      ).ref(rubric.rubric_id).on('click', this._openRubric.bind(this, rubric.rubric_id))
      if(rubric.rubric_id === this.state.rubric) node.addClass('se-active')
      el.append(node)
    })

    let activeRubricsTitle = $$('div').addClass('se-tree-node se-tree-title').append(
      $$('span').addClass('se-tree-node-name').append('Active Rubrics')
    )
    el.append(activeRubricsTitle)
    activeRubrics.forEach(rubric => {
      let node = $$('div').addClass('se-tree-node').append(
        $$('span').addClass('se-tree-node-name').append(rubric.name)
      ).ref(rubric.rubric_id).on('click', this._openRubric.bind(this, rubric.rubric_id))
      if(rubric.rubric_id === this.state.rubric) node.addClass('se-active')
      el.append(node)
    })

    return el
  }

  _renderRubric($$) {
    let el = $$('div').addClass('se-rubric')
    let rubric = this.state.rubric
    let data = this.state.rubricData
    let type = this.state.rubricType

    if(!rubric) {
      el.append('Click on rubric')
    } else {
      if(!type) {
        el.append('Loading...')
      } else {
        if(type === 'active') {
          el.append('Active rubric')
        } else if (type === 'learning') {
          el.append(
            this._renderDoc($$, data)
          )
        }
      }
    }

    return el
  }

  _renderDoc($$, data) {
    let el = $$('div').addClass('se-learning-doc')

    el.append(
      $$('div').addClass('se-title').append(data.doc.title),
      $$('div').addClass('se-abstract').append(data.doc.abstract),
      $$('div').addClass('se-controls').append(
        $$('i').addClass('fa fa-thumbs-up').attr('title', 'Yes!')
          .on('click', this._nextStep.bind(this, 1)),
        $$('i').addClass('fa fa-thumbs-down').attr('title', 'No!')
          .on('click', this._nextStep.bind(this, 2)),
        $$('i').addClass('fa fa-hand-o-right').attr('title', 'Skip')
          .on('click', this._nextStep.bind(this, 0))
      )
    )

    return el
  }

  _openRubric(id) {
    this.extendState({rubric: id})
  }

  _loadRubric(id) {
    this._loadActiveRubric(id, (err, activeRubric) => {
      if(activeRubric) {
        this.extendState({rubricData: activeRubric, rubricType: 'active'})
      } else {
        this._loadLearningRubric(id, (err, learningRubric) => {
          if(err) {
            console.error(err)
            return
          }
          this.extendState({rubricData: learningRubric.response, rubricType: 'learning'})
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
    fastartClient.getRubric(id, cb)
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

  _nextStep(answer) {
    let rubricId = this.state.rubric
    let rubricData = this.state.rubricData
    let docId = rubricData.doc.doc_id
    let answerData = {
      doc_id: docId,
      answer: answer
    }
    let fastartClient = this.context.fastartClient
    fastartClient.sendAnswer(rubricId, answerData, err => {
      if (err) {
        console.error(err)
        return
      }
      this._loadLearningRubric(rubricId, (err, result) => {
        if (err) {
          console.error(err)
          return
        }
        this.extendState({rubricData: result.response})
      })
    })
  }
}

export default Fastart

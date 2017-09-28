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
      mode: 'list',
      rubric: this.props.rubric
    }
  }

  willUpdateState(newState) {
    if(this.state.rubric !== newState.rubric && newState.rubric) {
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
      $$('span').addClass('se-tree-node-name').append('Learning Rubrics'),
      $$('span').addClass('se-tree-node-create').append(
        $$('i').addClass('fa fa-plus').attr('title', 'Add new rubric')
          .on('click', this._addLearningRubric.bind(this))
      )
    )
    el.append(learningRubricsTitle)
    learningRubrics.forEach(rubric => {
      let node = $$('div').addClass('se-tree-node se-node-status-' + rubric.status.toLowerCase()).append(
        $$('span').addClass('se-tree-node-name').append(rubric.name),
        $$('span').addClass('se-tree-node-status se-status-' + rubric.status.toLowerCase())
          .append(rubric.status.toLowerCase())
      ).ref(rubric.rubric_id)

      if(rubric.status === 'Marking') {
        node.on('click', this._openRubric.bind(this, rubric.rubric_id))
      }

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
    let mode = this.state.mode
    let data = this.state.rubricData
    let type = this.state.rubricType

    if(mode === 'list') {
      el.append(
        $$('div').addClass('se-choose').append(
          'Click on rubric'
        )
      )
    } else {
      if(mode === 'create') {
        el.append(this._renderCreateRubric($$))
      } else if (mode === 'docs') {
        if (type === 'learning') {
          el.append(this._renderDoc($$, data))
        } else {
          el.append('Loading...')
        }
      } else if (mode === 'edit') {
        if(type === 'active') {
          el.append(this._renderEditRubric($$))
        } else if (type === 'learning') {
          el.append(this._renderEditRubric($$))
        } else {
          el.append('Loading...')
        }
      }
    }

    return el
  }

  _renderDoc($$, data) {
    let el = $$('div').addClass('se-learning-doc')

    el.append(
      $$('div').addClass('se-edit-mode').append('Edit rubric')
        .on('click', this._editRubric.bind(this)),
      $$('div').addClass('se-title').append(data.doc.title),
      $$('div').addClass('se-abstract').append(data.doc.abstract)
    )

    if(!data.fulltext) {
      el.append(
        $$('div').addClass('se-load-fulltext').append(
          $$('button').addClass('sc-button sm-style-default se-button-fulltext')
            .append('Load Full Text')
            .on('click', this._loadFullText.bind(this))
        )
      )
    } else {
      el.append(
        $$('div').addClass('se-fulltext').append(data.fulltext)
      )
    }

    el.append(
      $$('div').addClass('se-controls').append(
        $$('i').addClass('fa fa-thumbs-up').attr('title', 'Yes!')
          .on('click', this._nextStep.bind(this, 1)),
        $$('span').addClass('se-positive-left').append(data.good_remaining.toString() + ' left'),
        $$('i').addClass('fa fa-thumbs-down').attr('title', 'No!')
          .on('click', this._nextStep.bind(this, 2)),
        $$('span').addClass('se-negative-left').append(data.bad_remaining.toString() + ' left'),
        $$('i').addClass('fa fa-hand-o-right').attr('title', 'Skip')
          .on('click', this._nextStep.bind(this, 0))
      )
    )

    return el
  }

  _renderCreateRubric($$) {
    let el = $$('div').addClass('se-edit-rubric')

    el.append(
      $$('input').addClass('sc-input se-input-name')
        .attr('placeholder', 'Enter rubric name')
        .ref('name'),
      $$('textarea').addClass('sc-input se-input-description')
        .attr('placeholder', 'Enter rubric description')
        .ref('description'),
      $$('textarea').addClass('sc-input se-input-query')
        .attr('placeholder', 'Enter rubric query')
        .ref('query'),
      $$('div').addClass('se-label').append(
        'Use underscore between words in a sequence and space between words from matching document. Use a comma for separting queries.'
      ),
      $$('button').addClass('sc-button sm-style-default se-button-save')
        .append('Save')
        .on('click', this._createLearningRubric.bind(this))
    )

    return el
  }

  _renderEditRubric($$) {
    let type = this.state.rubricType
    let data = this.state.rubricData

    let el = $$('div').addClass('se-edit-rubric')

    if(type === 'learning') {
      el.append(
        $$('input').addClass('sc-input se-input-name')
          .attr('placeholder', 'Enter rubric name')
          .val(data.name)
          .ref('name'),
        $$('textarea').addClass('sc-input se-input-description')
          .attr('placeholder', 'Enter rubric description')
          .val(data.desc)
          .ref('description'),
        $$('textarea').addClass('sc-input se-input-query')
          .attr('placeholder', 'Enter rubric query')
          .val(data.query)
          .ref('query'),
        $$('div').addClass('se-label').append(
          'Use underscore between words in a sequence and space between words from matching document. Use a comma for separting queries.'
        ),
        $$('div').addClass('se-controls').append(
          $$('button').addClass('sc-button sm-style-default se-button-save')
            .append('Save')
            .on('click', this._updateLearningRubric.bind(this)),
          $$('button').addClass('sc-button sm-style-default se-button-delete')
            .append('Delete')
            .on('click', this._deleteLearningRubric.bind(this))
        )
      )
    } else if (type === 'active') {
      el.append(
        $$('input').addClass('sc-input se-input-name')
          .attr('placeholder', 'Enter rubric name')
          .val(data.name)
          .ref('name'),
        $$('textarea').addClass('sc-input se-input-description')
          .attr('placeholder', 'Enter rubric description')
          .val(data.description)
          .ref('description'),
        $$('button').addClass('sc-button sm-style-default se-button-save')
          .append('Save')
          .on('click', this._updateActiveRubric.bind(this))
      )
    }

    return el
  }

  _addLearningRubric() {
    this.extendState({
      mode: 'create',
      rubricType: 'learning',
      rubricData: null,
      rubric: null
    })
  }

  _openRubric(id) {
    this.extendState({rubric: id})
  }

  _editRubric() {
    this.extendState({mode: 'edit'})
  }

  _editLearningRubric(id) {
    this.extendState({mode: 'edit', rubric: id})
  }

  _loadRubric(id) {
    this._loadActiveRubric(id, (err, activeRubric) => {
      if(activeRubric) {
        this.extendState({rubricData: activeRubric, rubricType: 'active', mode: 'edit'})
      } else {
        this._loadLearningRubric(id, (err, learningRubric) => {
          if(err) {
            console.error(err)
            return
          }
          this.extendState({rubricData: learningRubric.response, rubricType: 'learning', mode: 'docs'})
        })
      }
    })
  }

  _updateActiveRubric() {
    let rubricId = this.state.rubric
    let data = {
      name: this.refs.name.val(),
      description: this.refs.description.val()
    }

    let documentClient = this.context.documentClient
    documentClient.updateRubric(rubricId, data, err => {
      if (err) {
        console.error(err)
        return
      }

      let activeRubrics = this.state.activeRubrics
      let pos = activeRubrics.findIndex(item => {return item.rubric_id === rubricId})
      let rubric = activeRubrics[pos]
      rubric.name = data.name
      rubric.description = data.description
      activeRubrics[pos] = rubric

      this.extendState({
        mode: 'list',
        activeRubrics: activeRubrics,
        rubric: null,
        rubricData: null,
        rubricType: null
      })
    })
  }

  _loadActiveRubric(id, cb) {
    let documentClient = this.context.documentClient
    documentClient.getRubric(id, cb)
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

  /* Learning Rubrics */

  _createLearningRubric() {
    let data = {
      name: this.refs.name.val(),
      desc: this.refs.description.val(),
      query: this.refs.query.val()
    }

    let isValid = data.name && data.desc && data.query

    if(!isValid) return window.alert('Please fill out all form!')

    let fastartClient = this.context.fastartClient
    fastartClient.createRubric(data, (err, result) => {
      if (err) {
        console.error(err)
        return
      }

      let res = result.response

      if(!res) {
        window.alert('Not enough documents for your query. Please try again!')
      } else if (res.rubric_id) {
        this._loadLearningRubric(res.rubric_id, (err, result) => {
          if (err) {
            console.error(err)
            return
          }

          let learningRubrics = this.state.learningRubrics
          learningRubrics.push({
            name: data.name,
            rubric_id: res.rubric_id,
            status: 'Marking'
          })

          this.extendState({
            mode: 'docs',
            rubric: res.rubric_id,
            rubricData: result.response,
            rubricType: 'learning',
            learningRubrics: learningRubrics
          })
        })
      }
    })
  }

  _loadLearningRubric(id, cb) {
    let fastartClient = this.context.fastartClient
    fastartClient.getRubric(id, cb)
  }

  _updateLearningRubric() {
    let rubricId = this.state.rubric
    let rubricData = this.state.rubricData
    let data = {
      name: this.refs.name.val(),
      desc: this.refs.description.val(),
      query: this.refs.query.val()
    }

    let isValid = data.name && data.desc && data.query

    if(!isValid) return window.alert('Please fill out all form!')

    let fastartClient = this.context.fastartClient
    fastartClient.updateRubric(rubricId, data, (err, result) => {
      if (err) {
        console.error(err)
        return
      }

      let res = result.status

      if(res !== 'OK') {
        window.alert('Not enough documents for your query. Please try again!')
      } else {
        this._loadLearningRubric(rubricId, (err, result) => {
          if (err) {
            console.error(err)
            return
          }

          let learningRubrics = this.state.learningRubrics
          let pos = learningRubrics.findIndex(item => {return item.rubric_id === rubricId})
          let rubric = learningRubrics[pos]
          rubric.name = data.name
          learningRubrics[pos] = rubric

          this.extendState({
            mode: 'docs',
            learningRubrics: learningRubrics,
            rubricData: result.response
          })
        })
      }
    })
  }

  _deleteLearningRubric() {
    let rubricId = this.state.rubric
    let fastartClient = this.context.fastartClient
    fastartClient.deleteRubric(rubricId, err => {
      if (err) {
        console.error(err)
        return
      }

      let learningRubrics = this.state.learningRubrics
      let pos = learningRubrics.findIndex(item => {return item.rubric_id === rubricId})
      learningRubrics.splice(pos, 1)

      this.extendState({
        mode: 'list',
        rubric: null,
        rubricData: null,
        rubricType: null,
        learningRubrics: learningRubrics
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

  _loadFullText() {
    let rubricId = this.state.rubric
    let fastartClient = this.context.fastartClient
    fastartClient.getFullText(rubricId, (err, result) => {
      if (err) {
        console.error(err)
        return
      }

      let fulltext = result.response
      let data = this.state.rubricData
      data.fulltext = fulltext
      this.extendState({rubricData: data})
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
        if(result.status === 'OK') {
          this.extendState({rubricData: result.response})
        } else {
          let status = result.status

          let learningRubrics = this.state.learningRubrics
          let pos = learningRubrics.findIndex(item => {return item.rubric_id === rubricId})
          learningRubrics[pos].status = status

          this.extendState({
            mode: 'list',
            rubric: null,
            rubricData: null,
            rubricType: null,
            learningRubrics: learningRubrics
          })
        }
      })
    })
  }
}

export default Fastart

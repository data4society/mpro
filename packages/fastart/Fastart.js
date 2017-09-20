import { Component, SplitPane } from 'substance'

class Fastart extends Component {

  didMount() {
    this._loadRubrics()
  }

  getInitialState() {
    return {
      filters: {}
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

    el.append('test')

    return el
  }

  _renderRubric($$) {
    let el = $$('div').addClass('se-rubric')

    el.append('test')

    return el
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
}

export default Fastart

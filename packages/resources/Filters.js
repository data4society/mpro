import { Component, SubstanceError as Err } from 'substance'
import InputFilter from './InputFilter'
import SelectFilter from './SelectFilter'

class Filters extends Component {

  didMount() {
    this._loadFilterValues()
  }

  getInitialState() {
    return {
      selects: ['entity_class'],
      filterOptions: {}
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-filters')

    let quickFind = $$('div').addClass('se-quick-find').append(
      $$(InputFilter, {name: 'name', op: '~~*', type: 'text', placeholder: 'Enter resource name', filter: this.props.name})
    )

    let entityClassSelector = $$('div').addClass('sc-field-select').append(
      $$(SelectFilter, {name: 'entity_class', placeholder: 'Entity class', options: this.state.filterOptions['entity_class'], filter: this.props['entity_class']})
    )

    el.append(
      quickFind,
      entityClassSelector
    )

    return el
  }

  _loadFilterValues() {
    let documentClient = this.context.documentClient
    let selects = this.state.selects

    documentClient.getFilterValues(selects, 'entities', (err, options) => {
      if (err) {
        this.setState({
          error: new Err('Filters.LoadingError', {
            message: 'Filters could not be loaded.',
            cause: err
          })
        })
        console.error('ERROR', err)
        return
      }

      this.extendState({
        filterOptions: options
      })
    })
  }
}

export default Filters

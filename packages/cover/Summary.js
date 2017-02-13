import { Component } from 'substance'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import each from 'lodash/each'
import map from 'lodash/map'

class Summary extends Component {

  render($$) {
    let MetaSummary = this.getComponent('meta-summary')

    let el = $$('div').addClass('sc-document-summary')
    if (this.props.mobile) {
      el.addClass('sm-mobile')
    }
    
    let rubricsList = this.renderRubricsList($$)
    let probabilityList = this.renderProbabilityList($$)

    el.append(
      $$(MetaSummary),
      rubricsList,
      probabilityList,
      $$('div').addClass('se-separator')
    )

    return el
  }

  renderRubricsList($$) {
    let document = this.context.doc
    let rubrics = this.props.rubrics
    let selectedRubrics = document.get(['meta', 'rubrics'])
    let rubricsList = []

    let el = $$('div').addClass('se-rubrics')
    if(isEmpty(rubrics)) return el

    each(selectedRubrics, function(id) {
      let item = {
        name: rubrics.get([id, 'name']),
        root: rubrics.getRootParent(id).name
      }
      rubricsList.push(item)
    })

    el.append(this.context.iconProvider.renderIcon($$, 'rubrics'))

    let listEl = $$('div').addClass('sm-item')

    if(rubricsList.length > 0) {
      let groupedList = groupBy(rubricsList, 'root')

      each(groupedList, function(list, key) {
        let leaf = key.charAt(0).toUpperCase() + key.slice(1)
        listEl.append(
          $$('div').addClass('sm-leaf-item').append(
            leaf + ': ' + map(list, 'name').join(', ')
          )
        )
      })
    } else {
      listEl.append(this.getLabel('no-rubrics'))
    }

    el.append(listEl)
    return el
  }

  renderProbabilityList($$) {
    let document = this.context.doc
    let rubrics = this.props.rubrics
    let probability = document.get(['meta', 'probability'])
    let probabilityList = []

    let el = $$('div').addClass('se-rubrics')
    if(isEmpty(probability) || isEmpty(rubrics)) return el

    probability = map(probability, (val, prop) => {
      return { id: prop, value: val }
    })

    probability = probability.sort((a, b) => { return a.value - b.value })

    each(probability, function(p) {
      let item = rubrics.get([p.id, 'name']) + ': ' + parseFloat(p.value).toFixed(3)
      probabilityList.push(item)
    })

    el.append(this.context.iconProvider.renderIcon($$, 'probability'))

    let listEl = $$('div').addClass('sm-item')

    if(probabilityList.length > 0) {
      listEl.append(
        $$('div').addClass('sm-leaf-item').append(probabilityList.join(', '))
      )
    }

    el.append(listEl)
    return el
  }
}

export default Summary

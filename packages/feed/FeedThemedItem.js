import { Component } from 'substance'
import isEmpty from 'lodash/isEmpty'
import each from 'lodash/each'
import moment from 'moment'

class FeedThemedItem extends Component {

  shouldRerender(props) {
    if(props.update || props.document.theme_id !== this.props.document.theme_id) {
      return true
    }
    return false
  }

  render($$) {
    let document = this.props.document
    let meta = document.meta
    let el = $$('div').addClass('sc-feed-item')
      .on('click', this.send.bind(this, 'openDocument', document.documentId))

    let isActive = this.props.active === true

    if(isActive) {
      el.addClass('active')
    }

    let rubrics = this.renderRubrics($$)
    let source = this.renderSourceInfo($$)

    el.append(
      rubrics,
      source
    );

    if(meta.title !== '') {
      el.append(
        $$('div').addClass('se-title')
          .append(meta.title)
      )
    }

    el.append(
      $$('div').addClass('se-abstract')
        .append(meta.abstract),
      $$('div').addClass('se-more-topic').append(
        'All documents about ' + document.theme + ' (' + document.count + ') →'
      ).on('click', this._openTheme.bind(this, document.documentId, document.theme_id)),
      $$('div').addClass('se-separator')
    )

    return el
  }

  renderRubrics($$) {
    let document = this.props.document
    let meta = document.meta
    let rubrics = this.props.rubrics
    let rubricsMeta = meta.rubrics
    let rubricsList = []

    if(!isEmpty(rubrics)) {
      each(rubricsMeta, function(rubric) {
        let item = rubrics.get(rubric)
        rubricsList.push(item.name)
      })
    }

    let rubricsEl = $$('div').addClass('se-rubrics')
    rubricsEl.append(this.context.iconProvider.renderIcon($$, 'rubrics'))

    if(rubricsList.length > 0) {
      rubricsEl.append(rubricsList.join(', '))
    } else {
      rubricsEl.append('No categories assigned')
    }

    return rubricsEl
  }

  renderSourceInfo($$) {
    let document = this.props.document
    let meta = document.meta
    let published = this.props.document.published
    let publisher = meta.publisher
    let source_name = meta.source.split('/')[2]

    let el = $$('div').addClass('se-source-info')

    el.append(
      $$('div').addClass('se-source-name').append(
        publisher
      ),
      $$('a').addClass('se-source-url')
        .setAttribute('href', meta.source)
        .setAttribute('target', '_blank')
        .append(
          source_name
        ),
      $$('div').addClass('se-source-date').html(
        moment(published).format('DD.MM.YYYY HH:mm')
      )
    )

    return el
  }

  _openTheme(documentId, theme_id, e) {
    e.stopPropagation()
    this.send('openTheme', documentId, theme_id)
  }
}

export default FeedThemedItem

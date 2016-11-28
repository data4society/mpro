import { Button } from 'substance'
import moment from 'moment'
import FeedItem from '../feed/FeedItem'

class TngFeedItem extends FeedItem {

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

    let deleteBtn = $$(Button).addClass('se-delete-document').append(this.getLabel('delete-document'))
        .on('click', this.send.bind(this, 'deleteDocument', document.documentId))

    if(meta.accepted) {
      el.addClass('sm-accepted')
    } else {
      el.addClass('sm-not-accepted')
    }

    if(meta.moderated) {
      el.addClass('sm-moderated')
    } else {
      el.addClass('sm-not-moderated')
    }

    el.append(
      rubrics,
      source
    )
    
    if(meta.title !== '') {
      el.append(
        $$('div').addClass('se-title')
          .append(meta.title)
      )
    }

    el.append(
      $$('div').addClass('se-abstract')
        .append(meta.abstract),
      deleteBtn,
      $$('div').addClass('se-separator')
    )

    return el
  }

  renderSourceInfo($$) {
    let meta = this.props.document.meta
    let issue_date = this.props.document.created
    let el = $$('div').addClass('se-source-info')

    el.append(
      $$('div').addClass('se-source-name').append(
        meta.source_type
      ),
      $$('a').addClass('se-source-url')
        .setAttribute('href', meta.source)
        .setAttribute('target', '_blank')
        .append(
          meta.source_type
        ),
      $$('div').addClass('se-source-date').html(
        moment(issue_date).format('DD.MM.YYYY HH:mm')
      )
    )

    return el
  }
}

export default TngFeedItem

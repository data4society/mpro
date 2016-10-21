import FeedItem from '../feed/FeedItem'
import moment from 'moment'

class VkFeedItem extends FeedItem {

  renderSourceInfo($$) {
    let document = this.props.document
    let meta = document.meta
    let published = this.props.document.published
    let publisher = meta.author.name
    let source_name = this.context.iconProvider.renderIcon($$, 'vk')
    
    let el = $$('div').addClass('se-source-info')

    el.append(
      $$('div').addClass('se-source-name').append(
        publisher
      ),
      $$('div').addClass('se-source-url').append(
        source_name
      ),
      $$('div').addClass('se-source-date').html(
        moment(published).format('DD.MM.YYYY HH:mm')
      )
    )

    return el
  }
}

export default VkFeedItem

import { Component } from 'substance'
import moment from 'moment'

class VkMetaComponent extends Component {

  render($$) {
    let document = this.context.doc
    let meta = document.get('meta')
    let el = $$('div').addClass('sc-meta-summary')
    let published = $$('div').addClass('se-published').append(
      this.context.iconProvider.renderIcon($$, 'published'),
      $$('div').addClass('sm-item').append(
        this.getLabel('published-by') + ' ' + meta.author.name,
        this.getLabel('published-date') + ' ',
        moment(meta.published).format('DD.MM.YYYY HH:mm')
      )
    )
    let source = $$('div').addClass('se-source').append(
      this.context.iconProvider.renderIcon($$, 'source'),
      $$('div').addClass('sm-item').append(
        this.getLabel('source') + ' ',
        $$('a').addClass('se-source-url')
          .setAttribute('href', meta.source)
          .setAttribute('target', '_blank')
          .append(
            meta.source
          )
      )
    )

    el.append(
      published,
      source
    )

    return el
  }
}

export default VkMetaComponent

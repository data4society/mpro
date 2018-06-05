import { Component } from 'substance'
import moment from 'moment'

class ArticleMetaComponent extends Component {

  render($$) {
    let document = this.context.doc
    let meta = document.get('meta')
    let el = $$('div').addClass('sc-meta-summary')
    let published = $$('div').addClass('se-published').append(
      this.context.iconProvider.renderIcon($$, 'published'),
      $$('div').addClass('sm-item').append(
        this.getLabel('published-by') + ' ' + meta.publisher,
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

    const oiEditLink = meta.oi_express_url

    if(oiEditLink) {
      let oiEditLinkEl = $$('div').addClass('se-oi-edit-link').append(
        this.context.iconProvider.renderIcon($$, 'oi-edit-link'),
        $$('div').addClass('sm-item').append(
          $$('a').addClass('se-oi-edit-url')
            .setAttribute('href', oiEditLink)
            .setAttribute('target', '_blank')
            .append(
              oiEditLink
            )
        )
      )

      el.append(
        oiEditLinkEl
      )
    }

    return el
  }
}

export default ArticleMetaComponent

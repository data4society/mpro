import { Component } from 'substance'

class TngMetaComponent extends Component {

  render($$) {
    let document = this.context.doc
    let meta = document.get('meta')
    let el = $$('div').addClass('sc-meta-summary')
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

    el.append(source)

    return el
  }
}

export default TngMetaComponent

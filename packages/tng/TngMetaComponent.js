import { Component } from 'substance'

class TngMetaComponent extends Component {

  render($$) {
    let el = $$('div').addClass('sc-meta-summary')
    return el
  }
}

export default TngMetaComponent

import { Tool } from 'substance'

class OIExpressTool extends Tool {

  getClassNames() {
    let oiexpressClass = this.props.oiexpress ? 'sm-oi-published' : ''
    return 'se-tool-oiexpress ' + oiexpressClass
  }
}

export default OIExpressTool

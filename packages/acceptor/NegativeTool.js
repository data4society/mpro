import { Tool } from 'substance'

class NegativeTool extends Tool {

  getClassNames() {
    let negativeClass = this.props.negative ? 'sm-negative' : ''
    return 'se-tool-negative ' + negativeClass
  }
}

export default NegativeTool

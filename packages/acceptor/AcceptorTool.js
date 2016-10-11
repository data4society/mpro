import Tool from 'substance'

class AcceptorTool extends Tool {

  getClassNames() {
    let acceptedClass = this.props.accepted ? 'sm-accepted' : ''
    return 'se-tool-acceptor ' + acceptedClass
  }
}

export default AcceptorTool

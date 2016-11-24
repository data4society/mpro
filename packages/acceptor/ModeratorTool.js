import { Tool } from 'substance'

class ModeratorTool extends Tool {

  getClassNames() {
    let moderatorClass = this.props.moderated ? 'sm-moderated' : ''
    return 'se-tool-moderator ' + moderatorClass
  }
}

export default ModeratorTool

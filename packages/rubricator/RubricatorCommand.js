import { Command } from 'substance'

class RubricatorCommand extends Command {

  getCommandState() {
    return {
      disabled: false,
      active: false
    }
  }

  execute(props) {
    let documentSession = props.documentSession
    let rubrics = props.rubrics
    documentSession.transaction(function(tx) {
      tx.set(['meta', 'rubrics'], rubrics)
    })
    return true
  }
}

export default RubricatorCommand

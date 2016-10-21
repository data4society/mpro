import { Command } from 'substance'

class RubricatorCommand extends Command {

  getCommandState() {
    return {
      disabled: false,
      active: false
    }
  }

  execute(props) {
    var documentSession = props.documentSession
    var rubrics = props.rubrics
    documentSession.transaction(function(tx) {
      tx.set(['meta', 'rubrics'], rubrics)
    })
    return true
  }
}

export default RubricatorCommand

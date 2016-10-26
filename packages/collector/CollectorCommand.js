import { Command } from 'substance'

class CollectorCommand extends Command {

  getCommandState() {
    return {
      disabled: false,
      active: false
    }
  }

  execute(props) {
    var documentSession = props.documentSession
    var collections = props.collections
    documentSession.transaction(function(tx) {
      tx.set(['meta', 'collections'], collections)
    })
    return true
  }
}

export default CollectorCommand

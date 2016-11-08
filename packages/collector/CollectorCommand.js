import { Command } from 'substance'

class CollectorCommand extends Command {

  getCommandState() {
    return {
      disabled: false,
      active: false
    }
  }

  execute(props) {
    let documentSession = props.documentSession
    let collections = props.collections
    documentSession.transaction(function(tx) {
      tx.set(['meta', 'collections'], collections)
    })
    return true
  }
}

export default CollectorCommand

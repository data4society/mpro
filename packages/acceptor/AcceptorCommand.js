import { Command } from 'substance'

class AcceptorCommand extends Command {

  getCommandState(props, context) {
    var doc = context.doc
    var accepted = doc.get(['meta', 'accepted'])
    return {
      disabled: false,
      active: false,
      accepted: accepted
    }
  }

  execute(props, context) {
    var docSession = context.documentSession
    var currentValue = docSession.doc.get(['meta', 'accepted'])
    docSession.transaction(function(tx) {
      tx.set(['meta', 'accepted'], !currentValue)
    })
    return true
  }
}

export default AcceptorCommand

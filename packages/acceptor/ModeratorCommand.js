import { Command } from 'substance'

class ModeratorCommand extends Command {

  getCommandState(props, context) {
    var doc = context.doc
    var moderated = doc.get(['meta', 'moderated'])
    return {
      disabled: false,
      active: false,
      moderated: moderated
    }
  }

  execute(props, context) {
    var docSession = context.documentSession
    var currentValue = docSession.doc.get(['meta', 'moderated'])
    docSession.transaction(function(tx) {
      tx.set(['meta', 'moderated'], !currentValue)
    })
    return true
  }
}

export default ModeratorCommand

import { Command } from 'substance'

class NegativeCommand extends Command {

  getCommandState(props, context) {
    var doc = context.doc
    var negative = doc.get(['meta', 'negative'])
    return {
      disabled: false,
      active: false,
      negative: negative
    }
  }

  execute(props, context) {
    var docSession = context.documentSession
    var currentValue = docSession.doc.get(['meta', 'negative'])
    docSession.transaction(function(tx) {
      tx.set(['meta', 'negative'], !currentValue)
    })
    return true
  }
}

export default NegativeCommand

import { Command } from 'substance'

class OIExpressCommand extends Command {

  getCommandState(props, context) {
    var doc = context.doc
    var oiexpress = doc.get(['meta', 'oi_express'])
    return {
      disabled: false,
      active: false,
      oiexpress: oiexpress
    }
  }

  execute(props, context) {
    var docSession = context.documentSession
    var currentValue = docSession.doc.get(['meta', 'oi_express'])
    docSession.transaction(function(tx) {
      tx.set(['meta', 'oi_express'], !currentValue)
    })
    return true
  }
}

export default OIExpressCommand

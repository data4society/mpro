'use strict';

var ControllerTool = require('substance/ui/ControllerTool');

function AcceptorTool() {
  AcceptorTool.super.apply(this, arguments);
}
ControllerTool.extend(AcceptorTool);
AcceptorTool.static.name = 'acceptor';
AcceptorTool.static.command = 'acceptor';

module.exports = AcceptorTool;
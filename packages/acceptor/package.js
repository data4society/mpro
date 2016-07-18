'use strict';

var AcceptorTool = require('./AcceptorTool');
var AcceptorCommand = require('./AcceptorCommand');


module.exports = {
  name: 'acceptor',
  configure: function(config) {
    config.addTool(AcceptorTool, {editor: true});
    config.addCommand(AcceptorCommand);
    config.addIcon(AcceptorCommand.static.name, { 'fontawesome': 'fa-check' });
    config.addStyle(__dirname, '_acceptor');
  }
};
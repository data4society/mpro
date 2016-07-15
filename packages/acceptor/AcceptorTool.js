'use strict';

var Tool = require('substance/ui/Tool');

function AcceptorTool() {
  AcceptorTool.super.apply(this, arguments);
}

AcceptorTool.Prototype = function() {
  
  this.getClassNames = function() {
    var acceptedClass = this.props.accepted ? 'sm-accepted' : '';
    return 'se-tool-acceptor ' + acceptedClass;
  };

};

Tool.extend(AcceptorTool);
AcceptorTool.static.name = 'acceptor';
module.exports = AcceptorTool;
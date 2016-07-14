'use strict';

var oo = require('substance/util/oo');

/*
  Holds custom info about a document.

  This data is owned by the server, we must find a way to update it
  in realtime during an editing session
*/
function DocumentInfo(props) {
  this.props = props;

  if (!props.updatedBy) {
    this.props.updatedBy = 'Anonymous';
  }
}

oo.initClass(DocumentInfo);
module.exports = DocumentInfo;
'use strict';

var DocumentClient = require('substance/collab/DocumentClient');

/*
  HTTP client for talking with DocumentServer
*/

function MproDocumentClient() {
  MproDocumentClient.super.apply(this, arguments);
}

MproDocumentClient.Prototype = function() {

  this.listUserDashboard = function(cb) {
    // TODO: send filters and options to server
    this._request('GET', '/api/mpro/documents', null, cb);
  };

};

DocumentClient.extend(MproDocumentClient);

module.exports = MproDocumentClient;
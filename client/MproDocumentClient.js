'use strict';

var DocumentClient = require('substance/collab/DocumentClient');

/*
  HTTP client for talking with DocumentServer
*/

function MproDocumentClient() {
  MproDocumentClient.super.apply(this, arguments);
}

MproDocumentClient.Prototype = function() {

  this.listDocuments = function(filters, options, cb) {
    // TODO: send filters and options to server
    var filtersRequest = encodeURIComponent(JSON.stringify(filters));
    var optionsRequest = encodeURIComponent(JSON.stringify(options));
    this._request('GET', '/api/documents?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb);
  };

  this.listRubrics = function(filters, options, cb) {
    // TODO: send filters and options to server
    var filtersRequest = encodeURIComponent(JSON.stringify(filters));
    var optionsRequest = encodeURIComponent(JSON.stringify(options));
    this._request('GET', '/api/rubrics?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb);
  };

};

DocumentClient.extend(MproDocumentClient);

module.exports = MproDocumentClient;
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
    var filtersRequest = encodeURIComponent(JSON.stringify(filters));
    var optionsRequest = encodeURIComponent(JSON.stringify(options));
    this._request('GET', '/api/rubrics?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb);
  };

  this.listClasses = function(filters, options, cb) {
    var filtersRequest = encodeURIComponent(JSON.stringify(filters));
    var optionsRequest = encodeURIComponent(JSON.stringify(options));
    this._request('GET', '/api/classes?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb);
  };

  this.listFacets = function(facets, training, cb) {
    var facetsRequest = encodeURIComponent(JSON.stringify(facets));
    this._request('GET', '/api/facets?facets=' + facetsRequest + '&training=' + training, null, cb);
  };

  this.importData = function(file, classes, importer, cb) {
    this._request('GET', '/api/import?file=' + file + '&classes=' + classes + '&importer=' + importer, null, cb);
  };

};

DocumentClient.extend(MproDocumentClient);

module.exports = MproDocumentClient;
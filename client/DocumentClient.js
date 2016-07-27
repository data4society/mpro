'use strict';

var DocumentClient = require('substance/collab/DocumentClient');
var request = require('substance/util/request');

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
    request('GET', '/api/documents?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb);
  };

  this.listRubrics = function(filters, options, cb) {
    var filtersRequest = encodeURIComponent(JSON.stringify(filters));
    var optionsRequest = encodeURIComponent(JSON.stringify(options));
    request('GET', '/api/rubrics?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb);
  };

  this.listClasses = function(filters, options, cb) {
    var filtersRequest = encodeURIComponent(JSON.stringify(filters));
    var optionsRequest = encodeURIComponent(JSON.stringify(options));
    request('GET', '/api/classes?filters=' + filtersRequest + '&options=' + optionsRequest, null, cb);
  };

  this.listFacets = function(facets, training, cb) {
    var facetsRequest = encodeURIComponent(JSON.stringify(facets));
    request('GET', '/api/facets?facets=' + facetsRequest + '&training=' + training, null, cb);
  };

  this.importData = function(file, classes, importer, cb) {
    request('GET', '/api/import?file=' + file + '&classes=' + classes + '&importer=' + importer, null, cb);
  };

  this.updateSource = function(documentId, sourceData, cb) {
    request('PUT', '/api/sources/' + documentId, sourceData, cb);
  };

  this.createEntity = function(entityData, cb) {
    request('POST', '/api/entities', entityData, cb);
  };

  this.getEntity = function(entityId, cb) {
    request('GET', '/api/entities/' + entityId, null, cb);
  };

  this.updateEntity = function(entityId, entityData, cb) {
    request('PUT', '/api/entities/' + entityId, entityData, cb);
  };

  this.findEntities = function(value, restrictions, cb) {
    var restrictionsRequest = encodeURIComponent(JSON.stringify(restrictions));
    request('GET', '/api/entities/search?value=' + value + '&restrictions=' + restrictionsRequest, null, cb);
  };
};

DocumentClient.extend(MproDocumentClient);

module.exports = MproDocumentClient;
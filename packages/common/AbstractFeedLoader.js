'use strict';

var Component = require('substance/ui/Component');
var isEqual = require('lodash/isEqual');
var extend = require('lodash/extend');
var concat = require('lodash/concat');
var each = require('lodash/each');
var Rubric = require('../../models/rubric/Rubric');

/*
  Abstract Feed Loader class.

  Loads documents and rubrics.
*/

function AbstractFeedLoader() {
  Component.apply(this, arguments);
}

AbstractFeedLoader.Prototype = function() {

  this.didMount = function() {
    this._loadRubrics();
    this._loadDocuments();
    this.pollTimer = setInterval(this._pollDocuments.bind(this), 60000);
  };

  this.dispose = function() {
    clearInterval(this.pollTimer);
  };

  this.willUpdateState = function(state) {
    var oldFilters = this.state.filters;
    var newFilters = state.filters;
    if(!isEqual(oldFilters, newFilters)) {
      this._loadRubrics(newFilters);
      this._loadDocuments(newFilters);
    }
  };

  /*
    Initial state of component, contains:
    - filters: default filters (e.g. not show training documents)
    - perPage: number of documents per page
    - page: default page number
    - order: sort by property
    - direction: order of sorting (desc, asc)
    - documentItems: loaded document items (used internaly)
    - pagination: flag to show/hide pager (used internaly)
    - totalItems: total number of items (used internaly)
  */
  this.getInitialState = function() {
    return {
      filters: {'training': false, 'rubrics @>': []},
      perPage: 10,
      page: 1,
      order: 'created',
      direction: 'desc',
      documentItems: [],
      pagination: false,
      totalItems: 0,
      rubrics: {}
    };
  };

  /*
    Rubrics loader.

    Loads rubrics and creates document with all rubrics.
  */
  this._loadRubrics = function(filters) {
    var documentClient = this.context.documentClient;
    filters = filters || this.state.filters;

    documentClient.listRubrics(filters, {limit: 300}, function(err, result) {
      if (err) {
        console.error(err);
        this.setState({
          error: new Error('Rubrics loading failed')
        });
        return;
      }
      
      var configurator = this.context.configurator;
      var importer = configurator.createImporter('rubrics');
      var facets = this.state.filters['rubrics @>'];
      var rubrics = importer.importDocument(result, facets);
      rubrics.on('document:changed', this._onRubricsChanged, this);

      this.extendState({
        rubrics: rubrics
      });
    }.bind(this));
  };

  /*
    Loads documents
  */
  this._loadDocuments = function(filters) {
    var documentClient = this.context.documentClient;
    var perPage = this.state.perPage;
    var page = this.state.page;
    var order = this.state.order;
    var direction = this.state.direction;
    var pagination = this.state.pagination;
    var items = [];

    filters = filters || this.state.filters;

    documentClient.listDocuments(
      filters,
      { 
        limit: perPage, 
        offset: perPage * (page - 1),
        order: order + ' ' + direction
      }, 
      function(err, documents) {
        if (err) {
          console.error(err);
          this.setState({
            error: new Error('Documents loading failed')
          });
          return;
        }

        if(pagination) {
          items = concat(this.state.documentItems, documents.records);
        } else {
          items = documents.records;
        }

        this.extendState({
          documentItems: items,
          totalItems: documents.total,
          lastQueryTime: new Date()
        });
      }.bind(this)
    );
  };

  /*
    Documents long polling.
    Will query for a new documents with setted up filters
    since last query time.
  */
  this._pollDocuments = function() {
    var documentClient = this.context.documentClient;
    var filters = extend({}, this.state.filters, {"created >": this.state.lastQueryTime});
    var order = this.state.order;
    var direction = this.state.direction;
    var items = [];
    documentClient.listDocuments(
      filters,
      {
        order: order + ' ' + direction
      }, 
      function(err, documents) {
        if (err) {
          console.error(err);
          this.setState({
            error: new Error('Documents polling failed')
          });
          return;
        }

        if(documents.total > 0) {
          items = concat(documents.records, this.state.documentItems);
          this.extendState({
            documentItems: items,
            totalItems: parseInt(documents.total) + parseInt(this.state.totalItems),
            lastQueryTime: new Date()
          });
        }
      }.bind(this)
    );
  };

  /*
    Called when something is changed on rubric model.
    If some of rubrics got active, then we will load
    rubrics again with new filters.
  */
  this._onRubricsChanged = function(change) {
    var facetChange = false;
    each(change.updated, function(val, key){
      if(key.indexOf('active') > -1) {
        facetChange = true;
      }
    }.bind(this));

    if(facetChange) this._applyFacets();
  };

  /*
    Called when facets changed.
    Will change filters and load rubrics again.
  */
  this._applyFacets = function() {
    var rubrics = this.state.rubrics;
    var filters = this.state.filters;
    var newFilters = {};
    var facets = rubrics.getActive();
    rubrics.off(this);

    newFilters['rubrics @>'] = facets;
    this.extendState({filters: extend({}, filters, newFilters)});
  };
};

Component.extend(AbstractFeedLoader);

module.exports = AbstractFeedLoader;
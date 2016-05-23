'use strict';

var Component = require('substance/ui/Component');
// var Icon = require('substance/ui/FontAwesomeIcon');
// var filter = require('lodash/filter');
// var size = require('lodash/size');
var moment = require('moment');

var DocumentSummary = function() {
  DocumentSummary.super.apply(this, arguments);
};

DocumentSummary.Prototype = function() {

  this.render = function($$) {
    // var doc = this.context.controller.getDocument();
    var documentInfo = this.props.documentInfo.props;

    var updatedAt = moment(documentInfo.updatedAt).fromNow();

    var el = $$('div').addClass('sc-note-summary');
    if (this.props.mobile) {
      el.addClass('sm-mobile');
    }

    el.append(
      $$('div').addClass('se-item').append(
        'Updated ',
        updatedAt,
        ' by ',
        documentInfo.updatedBy
      )
    );
    return el;
  };
};

Component.extend(DocumentSummary);

module.exports = DocumentSummary;
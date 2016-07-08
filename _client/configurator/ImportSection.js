'use strict';

var Layout = require('substance/ui/Layout');
var Component = require('substance/ui/Component');
var Err = require('substance/util/Error');
var Header = require('../shared/Header');
var ImportForm = require('./ImportForm');
var each = require('lodash/each');

function ImportSection() {
  Component.apply(this, arguments);
}

ImportSection.Prototype = function() {

  this.didMount = function() {
    this._loadClasses();
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-import');

    el.append($$(Header, {
      actions: {
        'home': 'Inbox',
        'configurator': 'Configurator'      
      }
    }));

    var layout = $$(Layout, {
      width: 'medium',
      textAlign: 'center',
      noPadding: true
    });

    layout.append(
      $$(ImportForm, {classes: this.state.classes})
    );

    el.append(layout);

    return el;
  };

  this._loadClasses = function() {
    var documentClient = this.context.documentClient;

    documentClient.listClasses({}, {}, function(err, result) {
      if (err) {
        this.setState({
          error: new Err('Importer.LoadingError', {
            message: 'Classes could not be loaded.',
            cause: err
          })
        });
        console.error('ERROR', err);
        return;
      }

      each(result.records, function(rec) {
        rec.value = rec.class_id;
      });

      this.extendState({
        classes: result.records
      });
    }.bind(this));
  };
};

Component.extend(ImportSection);

module.exports = ImportSection;
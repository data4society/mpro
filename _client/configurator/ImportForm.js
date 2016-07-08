'use strict';

var Component = require('substance/ui/Component');
var Button = require('substance/ui/Button');
var ButtonGroup = require('./ButtonGroup');

function ImportForm() {
  Component.apply(this, arguments);
}

ImportForm.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-import-form');

    var intro;

    if(this.state.finished) {
      intro = $$('div').addClass('se-intro').append(
        'Import has been finished!'
      );

      el.append(intro);
    } else {
      intro = $$('div').addClass('se-intro').append(
        'Pickup .txt, .spans, .objects and .coref extensions from all to be imported OpenCorpora sets and zip it.\nUpload it and pickup classes. Press import button.'
      );

      el.append(intro);

      var fileUloader = $$('input').addClass('se-upload-file').attr('type', 'file')
        .on('change', this.handleFileUpload);

      var classesEl = $$(ButtonGroup, {options: this.props.classes}).ref('classes');

      var disabled = !this.state.file;
      var button = $$(Button, {disabled: disabled}).append('Import!').on('click', this.runImport);

      if(disabled) el.append(fileUloader);

      el.append(
        classesEl,
        button
      );
    }
    
    return el;
  };

  this.handleFileUpload = function(e) {
    var file = e.target.files[0];
    var fileClient = this.context.fileClient;
    fileClient.uploadFile(file, function(err, fileName) {
      this.extendState({
        file: fileName
      });
    }.bind(this));
  };

  this.runImport = function(e) {
    e.preventDefault();
    var importer = 'opencorpora';
    var file = this.state.file;
    var classes = this.refs.classes.getValues();
    var documentClient = this.context.documentClient;
    documentClient.importData(file, classes, importer, function(err) {
      if(err) console.error(err);
      this.extendState({
        'finished': true
      });
    }.bind(this));
  };

};

Component.extend(ImportForm);

module.exports = ImportForm;
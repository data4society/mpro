"use strict";

var oo = require('substance/util/oo');
var uuid = require('substance/util/uuid');
var Err = require('substance/util/Error');
var Promise = require('bluebird');
var extract = require('extract-zip');
var sortBy = require('lodash/sortBy');
var uniqBy = require('lodash/uniqBy');
var each = require('lodash/each');
var find = require('lodash/find');
var path = require('path');
var fs = require('fs');
var extend = require('lodash/extend')

var mv = Promise.promisify(require('mv'));
var exists = Promise.promisify(fs.access);
var readFile = Promise.promisify(fs.readFile);
var removeDir = Promise.promisify(require('rimraf'));

var oc_spans = {"фамилия":"oc_span_last_name",
	"имя":"oc_span_first_name",
	"отчество":"oc_span_middle_name",
	"ник":"oc_span_nickname",
	"иностранное_имя":"oc_span_foreign_name",
	"должность":"oc_span_post",
	"роль":"oc_span_role",
	"статус":"oc_span_status",
	"дескриптор":"oc_span_descriptor",
	"название":"oc_span_title",
	"номер":"oc_span_number",
	"гео._прилагательное":"oc_span_geo_adjective",
	"аббревиатура":"oc_span_abbreivation"
	};
var oc_classes = {"Персона":"oc_class_person","Организация":"oc_class_org","Локация":"oc_class_loc","Объект_инфраструктуры":"oc_class_infrastructure","GPE":"oc_class_gpe"};

/*
  Implements the Import Engine API.
*/
function ImportEngine(config) {
  this.config = config;
  this.uploadPath = config.uploadPath;
  this.sourceStore = config.sourceStore;
  //this.entityStore = config.entityStore;
  this.markupStore = config.markupStore;
  this.referenceStore = config.referenceStore;
  this.mentionStore = config.mentionStore;

  this.validateExtensions = ['txt','spans','objects'/*,'coref'*/];
  this.availableClasses = ['person','location','org'];
  //this.import(path.join(__dirname, '../../uploads/devset.zip'), this.availableClasses);
}

ImportEngine.Prototype = function() {

  /*
    Run import
  */
  this.import = function(file, classes) {
	//console.log(classes);
    file = path.join(__dirname, '../../uploads', file);
    var dir;
    return this.unzip(file)
      .then(function(res) {
        dir = res.dir;
        return this.collectSets(res.dir, res.files);
      }.bind(this)).then(function(sets) {
        return Promise.map(sets, function(set) {
          return this.importSet(dir, set, oc_classes);
        }.bind(this));
      }.bind(this)).then(function() {
        return this.removeUploadedSet(dir);
      }.bind(this)).catch(function(err) {
        console.error(err);
        return this.removeUploadedSet(dir);
      }.bind(this));
  };

  /*
    Import OK set
  */
  this.importSet = function(dir, set, classes) {
	var entity_classes_arr = [];
	for (var key in oc_spans){
		entity_classes_arr.push(oc_spans[key]);
	}
    var data;
    //var entities;
    var references;
    var mentions;
    return new Promise(function(resolve) {
      return this.prepareSet(dir, set, classes)
        .then(function(preparedData) {
          data = preparedData;
          // insert document source
          return this.sourceStore.createSource({
            source: data.source,
            stripped: data.source,
            status: 1100,
            type: 'oc'
          });
        }.bind(this)).then(function(source) {
          // insert markup
          return this.markupStore.createMarkup({
            document: source.doc_id,
            entity_classes: entity_classes_arr,
			name: new Date().toJSON() + " from Opencorpora",
            type: 51
          });
        }.bind(this)).then(function(markup) {
          // extract references and mentions
          return this.exctractData(data, markup.markup_id);
        }.bind(this)).then(function(exctracted) {
          //entities = exctracted.entities;
          references = exctracted.references;
          mentions = exctracted.mentions;

          /*return Promise.map(entities, function(entity) {
            return this.entityStore.createEntity(entity);
          }.bind(this));
        }.bind(this)).then(function() {*/
          return Promise.map(references, function(reference) {
            return this.referenceStore.createReference(reference);
          }.bind(this));
        }.bind(this)).then(function() {
		  return Promise.map(mentions, function(mention) {
            return this.mentionStore.createMention(mention);
          }.bind(this));
        }.bind(this)).then(function() {
          console.log('set has been imported ' + set);
          //console.log('imported entities:', entities.length);
          console.log('imported references:', references.length);
          console.log('imported mentions:', mentions.length);
          resolve();
        });
    }.bind(this));
  };

  /*
    Extracts entities and refrences from
    prepared OK set
  */
  this.exctractData = function(data, markup) {
    return new Promise(function(resolve) {
      var output = {};
      // Fill entities
      //var entities = [];
      // Fill references
      var references = [];
      var mentions = [];

	  var spans = data.spans;
	  each(spans, function(span, id) {
          references.push(extend({markup:markup}, span));
      });
      var objects = data.objects;
	  each(objects, function(object, id) {
          mentions.push(extend({markup:markup}, object));
      });
      /*each(objects, function(object, index) {
        object.refs = [];
        var spans = object.spans;

        // Populate spans with offsets
        each(spans, function(span) {
          var ref = {};
          ref.start_offset = data.spans[span].start_offset;
          ref.end_offset = data.spans[span].end_offset;
          ref.length_offset = data.spans[span].length_offset;
          object.refs.push(ref);
        });

        // Sort offset by start, so we could walk through
        // ordered spans and join them maybe
        object.refs = sortBy(object.refs, function(ref) { return ref.start_offset; });
        object.entity = find(data.coref, function(ref) { return ref.objects.indexOf(object.id) > -1; });
        entities.push({entity_id: object.entity.uuid, name: object.entity.name, entity_class: object.className});

        var reference = {
          reference_id: index,
          markup: markup,
          entity_class: object.className,
          entity: object.entity.uuid
        };

        if(object.refs.length == 1) {
          reference.start_offset = object.refs[0].start_offset;
          reference.end_offset = object.refs[0].length;
          references.push(reference);
        } else {
          var i = 0;
          while(i < object.refs.length) {
            if(reference.end_offset) {
              if(object.refs[i].start_offset - (reference.start_offset + reference.end_offset) < 2) {
                // expand
                reference.end_offset = object.refs[i].end_offset - reference.start_offset;
              } else {
                references.push(reference);
                reference = {
                  reference_id: uuid(),
                  markup: markup,
                  entity_class: object.className,
                  entity: object.entity.uuid,
                  start_offset: object.refs[i].start_offset,
                  end_offset: object.refs[i].length
                };
              }
            } else {
              reference.start_offset = object.refs[0].start_offset;
              reference.end_offset = object.refs[0].length;
            }

            if(object.refs.length - i === 1) {
              references.push(reference);
            }

            i++;
          }
        }

      });

      output.entities = uniqBy(entities, 'entity_id');*/
      output.references = references;
      output.mentions = mentions;
      resolve(output);
    }.bind(this));
  }; 

  /*
    Transforms OK files to json objects
  */
  this.prepareSet = function(dir, set, classes) {
    var results = {};
    var dirPath = path.join(this.uploadPath, dir, set);
    return new Promise(function(resolve) {
      return readFile(dirPath + '/' + set + '.txt', 'utf8')
        .then(function(source) {
          results.source = source;
          return readFile(dirPath + '/' + set + '.spans', 'utf8');
        }).then(function(spans) {
          
          /*
            transforms spans to json with structure: 
            
            '12345': {
			  reference_id: 'c2824c0f8e13057db67b16915080c831',
			  outer_id: '12345',
              entity_class: 'oc_span_first_name',
              start_offset: 1875,
              length_offset: 7,
              end_offset: 1882 
            }
          */

          var res = {};
          var lines = spans.split('\n');
          each(lines, function(line) {
            var item = {};
            var segments = line.split(' ');

            if(segments.length > 3) {
              item.reference_id = uuid();
              item.outer_id = segments[0];
              item.entity_class = oc_spans[segments[1]];
              item.start_offset = parseInt(segments[2]);
              item.length_offset = parseInt(segments[3]);
              item.end_offset = item.start_offset + item.length_offset;

              res[item.outer_id] = item;
            }
          });
          results.spans = res;
          return readFile(dirPath + '/' + set + '.objects', 'utf8');
        }).then(function(objects) {

          /*
            transforms objects to json with structure: 
            
            '56789': { 
			  mention_id: 'c2824c0f8e13057db67b16915080c831'
              outer_id: '56789', 
              entity_class: 'person',
              reference_ids: ['c2824c0f8e13057db67b16915080c833', 'c2824c0f8e13057db67b16915080c834']
            }
          */
          var res = {};
		if(objects){
			  //console.log(objects);
          var lines = objects.split('\n');
			  //console.log(lines);
			  //console.log(lines.length);
          each(lines, function(line){
            var item = {};
            var segments = line.split(' ');

            if(segments.length > 2 && segments[1] in classes) {
			  item.mention_id = uuid();
              item.outer_id = segments[0];
              item.entity_class = classes[segments[1]];
              item.reference_ids = [];

              var n = 2;
              while (segments[n] != '#') {
				if(segments[n] in results.spans){
					item.reference_ids.push(results.spans[segments[n]].reference_id);
				}
                n++;
              }
			  res[item.outer_id] = item;
              /*if(classes.indexOf(item.className) > -1) {
                var id = uuid();
                res[id] = item;
              }*/
            }
          }/*.bind(this)*/);
		}
          results.objects = res;
          /*return readFile(dirPath + '/' + set + '.coref', 'utf8');
        }.bind(this)).then(function(coref) {

          
            //transforms coref to json with structure: 
            
            //53399: { 
              //id: '53399', 
              //objects: ['234', '234234'],
              //name: 'Blah'
            //}
          
          var res = {};
          var corefItems = coref.split('\n\n');

          each(corefItems, function(corefItem) {
            var item = {};
            var lines = corefItem.split('\n');
            var ids = lines[0].split(' ');
            
            if(ids.length > 1) {
              item.id = ids[0];
              item.objects = [];
              item.name = [];
              
              var n = 1;
              while (n < ids.length) {
                item.objects.push(ids[n]);
                n++;
              }

              var lastProp; 
              n = 1;
              while (n < lines.length) {
                var lineItems = lines[n].split(' ');
                if(lineItems[0] == 'name') {
                  item.name = [];
                }
                if(lastProp != lineItems[0]) {
                  var i = 1;
                  while (i < lineItems.length) {
                    item.name.push(lineItems[i]);
                    i++;
                  }
                }
                lastProp = lineItems[0];
                n++;
                if(lineItems[0] == 'name') {
                  break;
                }
              }

              item.name = item.name.join(' ');

              var id = uuid();
              item.uuid = id;
              
              res[id] = item;
            }
          });
          results.coref = res;*/
          resolve(results);
        });
    }.bind(this));
  };

  /*
    Turns flat floder to set of folders with
    set names as directories names 
  */
  this.collectSets = function(dir, files) {
    return new Promise(function(resolve, reject) {
      var sets = [];
      return Promise.map(files, function(file) {
        var setName = file.split('.')[0];
        if(sets.indexOf(setName) == -1) sets.push(setName);

        var from = this.uploadPath + '/' + dir + '/' + file;
        var to = this.uploadPath + '/' + dir + '/' + setName + '/' + file;

        return mv(from, to, {mkdirp: true});
      }.bind(this)).then(function() {
        return this.validateSets(dir, sets);
      }.bind(this)).then(function() {
        resolve(sets);
      }).catch(function(err) {
        return reject(new Err('OpenCorpora.ValidationError', {
          cause: err,
          message: 'each set must have .txt, .spans and .coref files'
        }));
      });
    }.bind(this));
  };

  /*
    Performs validation
    Every folser with set most have files with
    all required extensions
  */
  this.validateSets = function(dir, sets) {
    return Promise.map(sets, function(set) {
      return Promise.map(this.validateExtensions, function(ex) {
        var filePath = path.join(this.uploadPath, dir, set, set + '.' + ex);
        return exists(filePath, fs.F_OK);
      }.bind(this));
    }.bind(this));
  };

  /*
    Unzip archive to folder with uuid name
  */
  this.unzip = function(source) {
    return new Promise(function(resolve, reject) {
      var dirName = uuid();
      var fileNames = [];
      extract(source, {
        dir: this.uploadPath + '/' + dirName,
        onEntry: function(e){fileNames.push(e.fileName);}
      }, function (err) {
        if (err) {
          return reject(new Err('OpenCorpora.ExctractionError', {
            cause: err
          }));
        }
        // fs.unlink(source, function(err) {
        //   if (err) {
        //     return reject(new Err('OpenCorpora.ExctractionError', {
        //       cause: err
        //     }));
        //   }

          resolve({dir: dirName, files: fileNames});
        //});
      });
    }.bind(this));
  };

  /*
    Removes folder with sets from one archive 
  */
  this.removeUploadedSet = function(dir) {
    return removeDir(this.uploadPath + '/' + dir);
  };

};

oo.initClass(ImportEngine);

module.exports = ImportEngine;
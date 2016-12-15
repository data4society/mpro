let fs = require('fs')
let path = require('path')
let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let ProgressBar = require('progress')
let Promise = require('bluebird')
let extract = require('extract-zip')
let each = require('lodash/each')
let extend = require('lodash/extend')

let mv = Promise.promisify(require('mv'))
let exists = Promise.promisify(fs.access)
let readDir = Promise.promisify(fs.readdir)
let readFile = Promise.promisify(fs.readFile)
let removeDir = Promise.promisify(require('rimraf'))

let oc_spans = {
  "фамилия":"oc_span_last_name",
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
}

let oc_classes = {
  "Персона":"oc_class_person",
  "Организация":"oc_class_org",
  "Локация":"oc_class_loc",
  "Объект_инфраструктуры":"oc_class_infrastructure",
  "GPE":"oc_class_gpe"
}

/*
  Implements the Import Engine API.
*/
class OpenCorpora {
  constructor(config) {
    this.config = config
    this.uploadPath = config.uploadPath
    this.markupStore = config.markupStore
    this.mentionStore = config.mentionStore
    this.referenceStore = config.referenceStore
    this.sourceStore = config.sourceStore

    this.validateExtensions = ['txt','spans','objects']
    this.availableClasses = ['person','location','org']
  }

  /*
    Run import
  */
  import(file) {
    console.log('Start unzipping', file)
    file = path.join(__dirname, '../../../uploads', file);
    let dir
    return this.unzip(file)
      .then(res => {
        console.log('Starting import...')
        dir = res.dir
        return this.collectSets(res.dir, res.files)
      }).then(sets => {
        return Promise.map(sets, set => {
          return this.importSet(dir, set, oc_classes)
        }, {concurrency: 5})
      }).then(() => {
        return this.removeUploadedSet(dir)
      }).catch(err => {
        console.error(err)
        return this.removeUploadedSet(dir)
      })
  }

  /*
    Run import
  */
  importDir(dir) {
    let dirpath = path.join(__dirname, '../../../uploads', dir)
    return readDir(dirpath)
      .then(files => {
        console.log('Starting set collecting...')
        return this.collectSets(dir, files)
      }).then(sets => {
        console.log('Starting set importing...')
        return Promise.map(sets, set => {
          return this.importSet(dir, set, oc_classes)
        }, {concurrency: 5})
      }).then(() => {
        return this.removeUploadedSet(dir)
      }).catch(err => {
        console.error(err)
        return this.removeUploadedSet(dir)
      })
  }

  /*
    Import OC set
  */
  importSet(dir, set, classes) {
    let entity_classes_arr = []
    for(let key in oc_spans) {
      entity_classes_arr.push(oc_spans[key])
    }
    let data, mentions, references

    return new Promise(resolve => {
      return this.prepareSet(dir, set, classes)
        .then(preparedData => {
          data = preparedData
          return this.sourceStore.createSource({
            source: data.source,
            stripped: data.source,
            status: 1100,
            type: 'oc'
          })
        }).then(source => {
          return this.markupStore.createMarkup({
            document: source.doc_id,
            entity_classes: entity_classes_arr,
            name: new Date().toJSON() + " from Opencorpora",
            type: 56
          })
        }).then(markup => {
          return this.exctractData(data, markup.markup_id)
        }).then(exctracted => {
          references = exctracted.references
          mentions = exctracted.mentions

          return Promise.map(references, reference => {
            return this.referenceStore.createReference(reference)
          })
        }).then(function() {
          return Promise.map(mentions, mention => {
            return this.mentionStore.createMention(mention)
          })
        }.bind(this)).then(function() {
          console.log('set has been imported ' + set)
          console.log('imported references:', references.length)
          console.log('imported mentions:', mentions.length)
          resolve()
        })
    })
  }

  /*
    Extracts entities and refrences from
    prepared OK set
  */
  exctractData(data, markup) {
    return new Promise(resolve => {
      let output = {}
      let references = []
      let mentions = []

      let spans = data.spans;
      each(spans, function(span) {
        references.push(extend({markup: markup}, span))
      })
      let objects = data.objects
      each(objects, function(object) {
        mentions.push(extend({markup: markup}, object))
      })
      output.references = references
      output.mentions = mentions
      resolve(output)
    })
  }

  /*
    Transforms OK files to json objects
  */
  prepareSet(dir, set, classes) {
    let results = {}
    let dirPath = path.join(this.uploadPath, dir, set)
    return new Promise(resolve => {
      return readFile(dirPath + '/' + set + '.txt', 'utf8')
        .then(function(source) {
          results.source = source
          return readFile(dirPath + '/' + set + '.spans', 'utf8')
        }).then(spans => {
          let res = {}
          let lines = spans.split('\n')
          each(lines, function(line) {
            let item = {}
            let segments = line.split(' ')

            if(segments.length > 3) {
              item.reference_id = uuid()
              item.outer_id = segments[0]
              item.entity_class = oc_spans[segments[1]]
              item.start_offset = parseInt(segments[2])
              item.length_offset = parseInt(segments[3])
              item.end_offset = item.start_offset + item.length_offset

              res[item.outer_id] = item
            }
          })
          results.spans = res
          return readFile(dirPath + '/' + set + '.objects', 'utf8')
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
          let res = {}
          if(objects) {
            let lines = objects.split('\n')
            each(lines, function(line){
              let item = {}
              let segments = line.split(' ')

              if(segments.length > 2 && segments[1] in classes) {
                item.mention_id = uuid()
                item.outer_id = segments[0]
                item.entity_class = classes[segments[1]]
                item.reference_ids = []

                let n = 2
                while (segments[n] != '#') {
                  if(segments[n] in results.spans) {
                    item.reference_ids.push(results.spans[segments[n]].reference_id)
                  }
                  n++
                }
                res[item.outer_id] = item
              }
            })
          }
          results.objects = res
          resolve(results)
        })
    })
  }

  /*
    Turns flat floder to set of folders with
    set names as directories names 
  */
  collectSets(dir, files) {
    let bar = new ProgressBar('  collecting sets [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: files.length
    })

    return new Promise((resolve, reject) => {
      let sets = [];
      return Promise.map(files, file => {
        let setName = file.split('.')[0]
        bar.tick(1)
        if(sets.indexOf(setName) === -1) sets.push(setName)

        let from = this.uploadPath + '/' + dir + '/' + file
        let to = this.uploadPath + '/' + dir + '/' + setName + '/' + file

        return mv(from, to, {mkdirp: true})
      }, {concurrency: 5}).then(() => {
        return this.validateSets(dir, sets)
      }).then(function() {
        resolve(sets)
      }).catch(function(err) {
        return reject(new Err('OpenCorpora.ValidationError', {
          cause: err,
          message: 'each set must have .txt, .spans and .coref files'
        }))
      })
    })
  }

  /*
    Performs validation
    Every folser with set most have files with
    all required extensions
  */
  validateSets(dir, sets) {
    return Promise.map(sets, set => {
      return Promise.map(this.validateExtensions, ex => {
        let filePath = path.join(this.uploadPath, dir, set, set + '.' + ex)
        return exists(filePath, fs.F_OK)
      }, {concurrency: 5})
    })
  }

  /*
    Unzip archive to folder with uuid name
  */
  unzip(source) {
    return new Promise((resolve, reject) => {
      let dirName = uuid()
      let fileNames = []
      extract(source, {
        dir: this.uploadPath + '/' + dirName,
        onEntry: function(e){fileNames.push(e.fileName)}
      }, function (err) {
        if (err) {
          return reject(new Err('OpenCorpora.ExctractionError', {
            cause: err
          }))
        }

        resolve({dir: dirName, files: fileNames})
      })
    })
  }

  /*
    Removes folder with sets from one archive 
  */
  removeUploadedSet(dir) {
    return removeDir(this.uploadPath + '/' + dir)
  }
}

module.exports = OpenCorpora

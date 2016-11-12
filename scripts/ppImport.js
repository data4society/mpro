/*
  General script for importing data from politpressing.org public database.
  Imports persons data and converts it to entities.
*/

let http = require('http')
let Promise = require('bluebird')
let isUndefined = require('lodash/isUndefined')
let Database = require('../packages/common/Database')
let Configurator = require('../packages/common/ServerConfigurator')
let StorePackage = require('../packages/store/package')

let db = new Database()
let configurator = new Configurator().import(StorePackage)
configurator.setDBConnection(db)

let entityStore = configurator.getStore('entity')

function getData() { 
  return new Promise(function(resolve, reject) {
    let url = 'http://up.d4s.io/openapi/persons?page=1&per_page=1000&sort_by=started&order=desc'
    http.get(url, function(res){
      let body = ''

      res.on('data', function(chunk){
        body += chunk;
      })

      res.on('end', function(){
        let response = JSON.parse(body)
        resolve(response)
      })
    }).on('error', function(e){
      reject(e)
    })
  })
}

function prepareEntity(data) {
  let entity = {
    name: data.name,
    created: new Date(),
    edited: new Date(),
    entity_class: 'Person',
    labels: [data.name],
    external_data: {
      pp_id: data._id
    },
    data: {
      lastname: data.surname,
      firstname: data.firstname
    }
  }

  let occupation = data.profession || []
  let index = occupation.indexOf('другое')
  if (index > -1) {
    occupation.splice(index, 1)
  }
  occupation.push('политпреследуемый')
  entity.data.occupation = occupation
  return entity
}

function entityExists(id) {
  return new Promise(function(resolve, reject) {
    db.connection.entities.findOne({"external_data->>pp_id": id}, function(err, entity) {
      if (err) return reject(err)
      resolve(!isUndefined(entity))
    })
  })
}

let entities = []

getData()
  .then(function(ppData) {
    let data = ppData[1]
    data.forEach(function(personData) {
      let person = prepareEntity(personData)
      entities.push(person)
    })
    return Promise.map(entities, function(item) {
      return entityExists(item.external_data.pp_id)
        .then(function(exists) {
          if(!exists) {
            return entityStore.createEntity(item)
          } else {
            return false
          }
        })
    }, {concurrency: 10})
  })
  .then(function() {
    console.log('Done!')
    db.shutdown()
  })
  .catch(function(e) {
    console.error(e)
    db.shutdown()
  })
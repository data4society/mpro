let testModule = require('substance-test').module

let Configurator = require('../../packages/common/ServerConfigurator')
let Database = require('../../packages/common/Database')
let StorePackage = require('../../packages/store/package')

const substanceTest = testModule('collab/RubricStore')

let configurator = new Configurator()
let rubricStore

function setup() {
  let db = new Database()
  
  return db.reset()
    .then(function() {
      db.shutdown()
      db = new Database()
      configurator.setDBConnection(db)
      configurator.import(StorePackage)
    })
    .then(function() {
      let userStore = configurator.getStore('user')
      return userStore.seed()
    })
    .then(function() {
      rubricStore = configurator.getStore('rubric')
      return rubricStore.seed()
    })
}

function teardown() {
  let db = configurator.getDBConnection()
  db.end()
}

function test(description, fn) {
  substanceTest(description, function (t) {
    setup().then(function(){
      t.once('end', teardown)
      fn(t)
    })
  })
}

/*
  Create rubric
*/

test('Should return new rubric record with given data', function(t) {
  let rubricData = {
    name: 'Test',
    parent_id: '3'
  }
  return rubricStore.createRubric(rubricData)
    .then(function(rubric) {
      t.isNotNil(rubric.rubric_id, 'Rubric should contains rubric_id')
      t.equal(rubric.name, rubricData.name, 'Rubric name should equals name from arguments')
      t.equal(rubric.parent_id, rubricData.parent_id, 'Rubric parent should equals parent_id from arguments')
      t.end()
    })
})

test('Should return new rubric record with given id', function(t) {
  let rubricData = {
    rubric_id: "non-existing-rubric"
  }
  return rubricStore.createRubric(rubricData)
    .then(function(rubric) {
      t.isNotNil(rubric.rubric_id, 'Rubric should contains rubric_id')
      t.equal(rubric.rubric_id, rubricData.rubric_id, 'Rubric id should equals rubric_id from arguments')
      t.end()
    })
})

test('Should return empty name in new rubric record if it wasn\'t provided', function(t) {
  let rubricData = {
    parent_id: "4"
  }
  return rubricStore.createRubric(rubricData)
    .then(function(rubric) {
      t.isNotNil(rubric.rubric_id, 'Rubric should contains rubric_id')
      t.equal(rubric.name, '', 'Rubric name should equals empty string')
      t.end()
    })
})

test('Should return error if rubric with given rubric_id already exist', function(t) {
  let rubricData = {
    rubric_id: "1"
  }
  return rubricStore.createRubric(rubricData)
    .then(function(rubric) {
      t.isNil(rubric)
    }).catch(function(err) {
      t.isNotNil(err, 'Should error')
      t.equal(err.message, 'Rubric ' + rubricData.rubric_id + ' already exists.', 'Error message should equals to given one')
      t.end()
    })
})

/*
  Get rubric
*/

test('Should return rubric record with given id', function(t) {
  let rubricId = '1'
  return rubricStore.getRubric(rubricId)
    .then(function(rubric) {
      t.equal(rubric.rubric_id, rubricId, 'Rubric id should equals rubricId from arguments')
      t.end()
    })
})

test('Should return error if rubricId with given id does not exist', function(t) {
  let rubricId = 'non-existing-rubric'
  return rubricStore.getRubric(rubricId)
    .then(function(rubric) {
      t.isNil(rubric)
    }).catch(function(err) {
      t.isNotNil(err, 'Should error')
      t.equal(err.message, 'No rubric found for rubric_id ' + rubricId, 'Error message should equals to given one')
      t.end()
    })
})

/*
  Update rubric
*/

test('Should update rubric and return updated record', function(t) {
  let rubricId = '1'
  let data = {
    name: 'Test rubric'
  }

  return rubricStore.updateRubric(rubricId, data)
    .then(function(rubric) {
      t.isNotNil(rubric, 'Rubric should exists')
      t.equal(rubric.rubric_id, rubricId, 'Rubric id should equals rubricId from arguments')
      t.equal(rubric.name, data.name, 'Rubric name should equals name from arguments')
      return rubricStore.getRubric(rubricId)
    })
    .then(function(rubric) {
      t.isNotNil(rubric, 'Rubric should exists')
      t.equal(rubric.rubric_id, rubricId, 'Rubric id should equals rubricId from arguments')
      t.equal(rubric.name, data.name, 'Rubric name should equals name from arguments')
      t.end()
    })
})

/*
  Delete rubric
*/

test('Should delete rubric and return deleted record for a last time', function(t) {
  let rubricId = '4'

  return rubricStore.deleteRubric(rubricId)
    .then(function(rubric) {
      t.isNotNil(rubric, 'Rubric should exists')
      t.equal(rubric.rubric_id, rubricId, 'Rubric id should equals rubricId from arguments')
      return rubricStore.getRubric(rubricId)
    })
    .catch(function(err) {
      t.isNotNil(err, 'Should error')
      t.equal(err.message, 'No rubric found for rubric_id ' + rubricId, 'Error message should equals to given one')
      t.end()
    })
})

test('Should return error in case of non-existing record', function(t) {
  let rubricId = 'non-existing-rubric'

  return rubricStore.deleteRubric(rubricId)
    .catch(function(err) {
      t.isNotNil(err, 'Should error')
      t.equal(err.message, 'Rubric with rubric_id ' + rubricId + ' does not exists', 'Error message should equals to given one')
      t.end()
    })
})

/*
  Rubric existance
*/

test('Should return true in case of existed record', function(t) {
  let rubricId = '1'

  return rubricStore.rubricExists(rubricId)
    .then(function(exist) {
      t.equal(exist, true, 'Rubric should exists')
      t.end()
    })
})

test('Should return false in case of non-existed record', function(t) {
  let rubricId = 'non-existing-rubric'

  return rubricStore.rubricExists(rubricId)
    .then(function(exist) {
      t.equal(exist, false, 'Rubric should not exists')
      t.end()
    })
})
let testModule = require('substance-test').module

let Configurator = require('../../packages/common/ServerConfigurator')
let Database = require('../../packages/common/Database')
let StorePackage = require('../../packages/store/package')

const substanceTest = testModule('collab/ChangeStore')

let configurator = new Configurator()
let changeStore

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
      let documentStore = configurator.getStore('document')
      return documentStore.seed()
    })
    .then(function() {
      changeStore = configurator.getStore('change')
      return changeStore.seed()
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
  Add changes
*/

test('Add a new change to document', function(t) {
  let args = {
    documentId: '2',
    change: {
      ops: [{some: 'operation'}],
      // the info object is meant to store any custom information
      info: {
        userId: 'testuser'
      }
    }
  }

  changeStore.addChange(args, function(err, version) {
    t.isNil(err, 'Should not error')
    t.equal(version, 2, 'Version should have been incremented by 1')

    changeStore.getChanges({
      documentId: '2',
      sinceVersion: 0
    }, function(err, result) {
      t.isNil(err, 'Should not error')
      t.equal(result.changes.length, 2, 'There should be two changes in the db')
      t.isNotNil(result.changes[0].ops, 'changes most contain array of change objects')
      t.equal(result.version, 2, 'New version should be 2')
      t.end()
    })
  })
})

test('Should only create changes associated with a documentId', function(t) {
  let args = {
    change: {
      ops: [{some: 'operation'}],
      // the info object is meant to store any custom information
      info: {
        userId: 'testuser'
      }
    }
  }

  changeStore.addChange(args, function(err, version) {
    t.isNotNil(err, 'Should error')
    t.isNil(version, 'Should not return version')
    t.equal(err.name, 'ChangeStore.CreateError', 'Error should named ChangeStore.CreateError')
    t.end()
  })
})

/*
  Read changes
*/

test('Should return changes of a document', function(t) {
  let args = {
    documentId: '1',
    sinceVersion: 0
  }

  changeStore.getChanges(args, function(err, result) {
    t.isNil(err, 'Should not error')
    t.isNotNil(result, 'Should return result')
    t.equal(result.changes.length, 4, 'Should return 4 changes')
    t.equal(result.version, 4, 'Version should be 4')
    t.end()
  })
})

test('Should return all changes of a document by not specifying sinceVersion', function(t) {
  let args = {
    documentId: '1'
  }

  changeStore.getChanges(args, function(err, result) {
    t.isNil(err, 'Should not error')
    t.isNotNil(result, 'Should return result')
    t.equal(result.changes.length, 4, 'Should return 4 changes')
    t.equal(result.version, 4, 'Version should be 4')
    t.end()
  })
})

test('Should return no changes if sinceVersion equals actual version', function(t) {
  let args = {
    documentId: '1',
    sinceVersion: 4
  }

  changeStore.getChanges(args, function(err, result) {
    t.isNil(err, 'Should not error')
    t.isNotNil(result, 'Should return result')
    t.equal(result.changes.length, 0, 'Should return 0 changes')
    t.equal(result.version, 4, 'Version should be 4')
    t.end()
  })
})

test('Should return changes of a document between version 1 and version 2', function(t) {
  let args = {
    documentId: '1',
    sinceVersion: 1,
    toVersion: 2
  }

  changeStore.getChanges(args, function(err, result) {
    t.isNil(err, 'Should not error')
    t.isNotNil(result, 'Should return result')
    t.equal(result.changes.length, 1, 'Should return 1 change')
    t.equal(result.version, 4, 'Version should be 4')
    t.end()
  })
})

test('Should return error in case of invalid use of getChanges sinceVersion argument', function(t) {
  let args = {
    documentId: '1',
    sinceVersion: -5
  }

  changeStore.getChanges(args, function(err, result) {
    t.isNotNil(err, 'Should error')
    t.isNil(result, 'Should not return result')
    t.equal(err.name, 'ChangeStore.ReadError', 'Error should named ChangeStore.ReadError')
    t.end()
  })
})

test('Should return error in case of invalid use of getChanges toVersion argument', function(t) {
  let args = {
    documentId: '1',
    toVersion: -3
  }

  changeStore.getChanges(args, function(err, result) {
    t.isNotNil(err, 'Should error')
    t.isNil(result, 'Should not return result')
    t.equal(err.name, 'ChangeStore.ReadError', 'Error should named ChangeStore.ReadError')
    t.end()
  })
})

test('Should return error in case of invalid use of getChanges version arguments', function(t) {
  let args = {
    documentId: '1',
    sinceVersion: 2,
    toVersion: 1
  }

  changeStore.getChanges(args, function(err, result) {
    t.isNotNil(err, 'Should error')
    t.isNil(result, 'Should not return result')
    t.equal(err.name, 'ChangeStore.ReadError', 'Error should named ChangeStore.ReadError')
    t.end()
  })
})

/*
  Get version
*/

test('Should return version of a document', function(t) {
  let documentId = 1

  changeStore.getVersion(documentId, function(err, version) {
    t.isNil(err, 'Should not error')
    t.isNotNil(version, 'Should return version')
    t.equal(version, 4, 'Version should be 4')
    t.end()
  })
})

test('Should return version 0 if no changes are found', function(t) {
  let documentId = 'non-existing-doc'

  changeStore.getVersion(documentId, function(err, version) {
    t.isNil(err, 'Should not error')
    t.isNotNil(version, 'Should return version')
    t.equal(version, 0, 'Version should be 4')
    t.end()
  })
})

/*
  Delete changes
*/

test('Should delete all changes of a document', function(t) {
  let documentId = 1

  changeStore.deleteChanges(documentId, function(err, count) {
    t.isNil(err, 'Should not error')
    t.isNotNil(count, 'Should return count')
    t.equal(count, 4, 'Version should be 4')

    changeStore.getChanges({
      documentId: documentId,
      sinceVersion: 0
    }, function(err, result) {
      t.isNil(err, 'Should not error')
      t.isNotNil(result, 'Should return result')
      t.equal(result.changes.length, 0, 'Should return 0 changes')
      t.equal(result.version, 0, 'Version should be 0')
      t.end()
    })
  })
})

test('Counter of deleted changes should equals 0 if no changes are found', function(t) {
  let documentId = 'non-existing-doc'

  changeStore.deleteChanges(documentId, function(err, count) {
    t.isNil(err, 'Should not error')
    t.isNotNil(count, 'Should return count')
    t.equal(count, 0, 'Version should be 4')
    t.end()
  })
})
'use strict';

var substanceTest = require('substance/test/test').module('server/EntityStore');

var Database = require('../../server/Database');
var EntityStore = require('../../server/EntityStore');
var UserStore = require('../../server/UserStore');

var db, entityStore, userStore;

function setup() {
  db = new Database();
  return db.reset()
    .then(function() {
      userStore = new UserStore({db: db});
      return userStore.seed();
    })
    .then(function() {
      entityStore = new EntityStore({ db: db });
      return entityStore.seed();
    }).then(function(){
      // we have to shutdown db connection and establish test again one time
      // so massive will have all methods attached to test's DB object
      // if we will not do test massive will not have methods atatched to table
      // because there was no tables when we started first unit test
      db.connection.end();
      db = new Database();
      entityStore = new EntityStore({ db: db });
    });
}

function teardown() {
  db.connection.end();
}

function test(description, fn) {
  substanceTest(description, function (t) {
    setup().then(function(){
      t.once('end', teardown);
      fn(t);
    });
  });
}

/*
  Create entity
*/

test('Should return new entity record with given data', function(t) {
  var entityData = {
    name: 'Test'
  };
  return entityStore.createEntity(entityData)
    .then(function(entity) {
      t.isNotNil(entity.entity_id, 'Entity should contains entity_id');
      t.equal(entity.name, entityData.name, 'Entity name should equals name from arguments');
      t.end();
    });
});

test('Should return new entity record with given id', function(t) {
  var entityData = {
    entity_id: "non-existing-entity"
  };
  return entityStore.createEntity(entityData)
    .then(function(entity) {
      t.isNotNil(entity.entity_id, 'Entity should contains entity_id');
      t.equal(entity.entity_id, entityData.entity_id, 'Entity id should equals entity_id from arguments');
      t.end();
    });
});

test('Should return empty name in new entity record if it wasn\'t provided', function(t) {
  var entityData = {
    data: {'a': 'b'}
  };
  return entityStore.createEntity(entityData)
    .then(function(entity) {
      t.isNotNil(entity.entity_id, 'Entity should contains entity_id');
      t.equal(entity.name, '', 'Entity name should equals empty string');
      t.end();
    });
});

test('Should return empty data object in new entity record if it wasn\'t provided', function(t) {
  var entityData = {
    name: 'Test'
  };
  return entityStore.createEntity(entityData)
    .then(function(entity) {
      t.isNotNil(entity.entity_id, 'Entity should contains entity_id');
      t.deepEqual(entity.data, {}, 'Entity data should equals empty object');
      t.end();
    });
});

test('Should return error if entity with given entity_id already exist', function(t) {
  var entityData = {
    entity_id: "1"
  };
  return entityStore.createEntity(entityData)
    .then(function(entity) {
      t.isNil(entity, 'Entity should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'Entity ' + entityData.entity_id + ' already exists.', 'Error message should equals to given one');
      t.end();
    });
});

/*
  Get entity
*/

test('Should return entity record with given id', function(t) {
  var entityId = '1';
  return entityStore.getEntity(entityId)
    .then(function(entity) {
      t.equal(entity.entity_id, entityId, 'Entity id should equals entityId from arguments');
      t.end();
    });
});

test('Should return error if entity with given id does not exist', function(t) {
  var entityId = 'non-existing-entity';
  return entityStore.getEntity(entityId)
    .then(function(entity) {
      t.isNil(entity, 'Entity should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No entity found for entity_id ' + entityId, 'Error message should equals to given one');
      t.end();
    });
});

/*
  Update entity
*/

test('Should update entity and return updated record', function(t) {
  var entityId = '1';
  var data = {
    name: 'Test entity'
  };

  return entityStore.updateEntity(entityId, data)
    .then(function(entity) {
      t.isNotNil(entity, 'Entity should exists');
      t.equal(entity.entity_id, entityId, 'Entity id should equals entityId from arguments');
      t.equal(entity.name, data.name, 'Entity name should equals name from arguments');
      return entityStore.getEntity(entityId);
    })
    .then(function(entity) {
      t.isNotNil(entity, 'Entity should exists');
      t.equal(entity.entity_id, entityId, 'Entity id should equals entityId from arguments');
      t.equal(entity.name, data.name, 'Entity name should equals name from arguments');
      t.end();
    });
});

/*
  Delete entity
*/

test('Should delete entity and return deleted record for a last time', function(t) {
  var entityId = '4';

  return entityStore.deleteEntity(entityId)
    .then(function(entity) {
      t.isNotNil(entity, 'Entity should exists');
      t.equal(entity.entity_id, entityId, 'Entity id should equals entityId from arguments');
      return entityStore.getEntity(entityId);
    })
    .catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No entity found for entity_id ' + entityId, 'Error message should equals to given one');
      t.end();
    });
});

test('Should return error in case of non-existing record', function(t) {
  var entityId = 'non-existing-entity';

  return entityStore.deleteEntity(entityId)
    .catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'Entity with entity_id ' + entityId + ' does not exists', 'Error message should equals to given one');
      t.end();
    });
});

/*
  Entity existance
*/

test('Should return true in case of existed record', function(t) {
  var entityId = '1';

  return entityStore.entityExists(entityId)
    .then(function(exist) {
      t.equal(exist, true, 'Entity should exists');
      t.end();
    });
});

test('Should return false in case of non-existed record', function(t) {
  var entityId = 'non-existing-entity';

  return entityStore.entityExists(entityId)
    .then(function(exist) {
      t.equal(exist, false, 'Entity should not exists');
      t.end();
    });
});
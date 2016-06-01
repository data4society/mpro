var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var EntityStore = require('../../server/EntityStore');
var UserStore = require('../../server/UserStore');

describe('Entity Store', function() {
  var db = new Database();

  var entityStore = new EntityStore({db: db});
  var userStore = new UserStore({db: db});

  // we have to shutdown db connection and establish it again one time
  // so massive will have all methods attached to it's DB object
  // if we will not do it massive will not have methods atatched to table
  // because there was no tables when we started first unit test
  before(function(done) {
    db.reset()
      .then(function() {
        var userStore = new UserStore({db: db});
        return userStore.seed();
      })
      .then(function() {
        var entityStore = new EntityStore({ db: db });
        return entityStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();
        entityStore = new EntityStore({db: db});
        
        done();
      });
  });

  beforeEach(function(done) {
    db.reset()
      .then(function() {
        var userStore = new UserStore({db: db});
        return userStore.seed();
      })
      .then(function() {
        var entityStore = new EntityStore({ db: db });
        return entityStore.seed();
      }).then(done);
  });

  describe('Create entity', function() {
    it('should return new entity record with given data', function(done) {
      var entityData = {
        name: 'Test'
      };
      return entityStore.createEntity(entityData)
        .then(function(entity) {
          entity.should.be.an('object');
          should.exist(entity.entity_id);
          assert.equal(entity.name, entityData.name);
          done();
        });
    });

    it('should return new entity record with given id', function(done) {
      var entityData = {
        entity_id: "non-existing-entity"
      };
      return entityStore.createEntity(entityData)
        .then(function(entity) {
          entity.should.be.an('object');
          should.exist(entity.entity_id);
          assert.equal(entity.entity_id, entityData.entity_id);
          done();
        });
    });

    it('should return empty name in new entity record if it wasn\'t provided', function(done) {
      var entityData = {
        data: {'a': 'b'}
      };
      return entityStore.createEntity(entityData)
        .then(function(entity) {
          entity.should.be.an('object');
          should.exist(entity.entity_id);
          assert.equal(entity.name, '');
          done();
        });
    });

    it('should return empty data object in new entity record if it wasn\'t provided', function(done) {
      var entityData = {
        name: 'Test'
      };
      return entityStore.createEntity(entityData)
        .then(function(entity) {
          entity.should.be.an('object');
          should.exist(entity.entity_id);
          assert.deepEqual(entity.data, {});
          done();
        });
    });

    it('should return error if entity with given entity_id already exist', function(done) {
      var entityData = {
        entity_id: "1"
      };
      return entityStore.createEntity(entityData)
        .then(function(entity) {
          should.not.exist(entity);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Entity ' + entityData.entity_id + ' already exists.');
          done();
        });
    });
  });

  describe('Get entity', function() {
    it('should return entity record with given id', function(done) {
      var entityId = '1';
      return entityStore.getEntity(entityId)
        .then(function(entity) {
          entity.should.be.an('object');
          assert.equal(entity.entity_id, entityId);
          done();
        });
    });

    it('should return error if entity with given id does not exist', function(done) {
      var entityId = 'non-existing-entity';
      return entityStore.getEntity(entityId)
        .then(function(entity) {
          should.not.exist(entity);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No entity found for entity_id ' + entityId);
          done();
        });
    });
  });

  describe('Update entity', function() {
    it('should update entity and return updated record', function(done) {
      var entityId = '1';
      var data = {
        name: 'Test entity'
      };

      return entityStore.updateEntity(entityId, data)
        .then(function(entity) {
          should.exist(entity);
          entity.should.be.an('object');
          assert.equal(entity.entity_id, entityId);
          assert.equal(entity.name, data.name);
          return entityStore.getEntity(entityId);
        })
        .then(function(entity) {
          should.exist(entity);
          entity.should.be.an('object');
          assert.equal(entity.entity_id, entityId);
          assert.equal(entity.name, data.name);
          done();
        });
    });
  });

  describe('Delete entity', function() {
    it('should delete entity and return deleted record for a last time', function(done) {
      var entityId = '4';

      return entityStore.deleteEntity(entityId)
        .then(function(entity) {
          should.exist(entity);
          entity.should.be.an('object');
          assert.equal(entity.entity_id, entityId);
          return entityStore.getEntity(entityId);
        })
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No entity found for entity_id ' + entityId);
          done();
        });
    });

    it('should return error in case of non-existing record', function(done) {
      var entityId = 'non-existing-entity';

      return entityStore.deleteEntity(entityId)
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Entity with entity_id ' + entityId + ' does not exists');
          done();
        });
    });
  });

  describe('Entity existance', function() {
    it('should return true in case of existed record', function(done) {
      var entityId = '1';

      return entityStore.entityExists(entityId)
        .then(function(exist) {
          assert.equal(exist, true);
          done();
        });
    });

    it('should return false in case of non-existed record', function(done) {
      var entityId = 'non-existing-entity';

      return entityStore.entityExists(entityId)
        .then(function(exist) {
          assert.equal(exist, false);
          done();
        });
    });
  });
});
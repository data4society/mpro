var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var ThematicStore = require('../../server/ThematicStore');

describe('Thematic Store', function() {
  var db = new Database();

  var thematicStore = new ThematicStore({db: db});

  // we have to shutdown db connection and establish it again one time
  // so massive will have all methods attached to it's DB object
  // if we will not do it massive will not have methods atatched to table
  // because there was no tables when we started first unit test
  before(function(done) {
    db.reset()
      .then(function() {
        var thematicStore = new ThematicStore({ db: db });
        return thematicStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();
        thematicStore = new ThematicStore({db: db});
        
        done();
      });
  });

  beforeEach(function(done) {
    db.reset()
      .then(function() {
        var thematicStore = new ThematicStore({ db: db });
        return thematicStore.seed();
      }).then(done);
  });

  describe('Create thematic', function() {
    it('should return new thematic record with given data', function(done) {
      var thematicData = {
        title: 'Test',
        parent_id: '3'
      };
      return thematicStore.createThematic(thematicData)
        .then(function(thematic) {
          thematic.should.be.an('object');
          should.exist(thematic.thematic_id);
          assert.equal(thematic.title, thematicData.title);
          assert.equal(thematic.parent_id, thematicData.parent_id);
          done();
        });
    });

    it('should return new thematic record with given id', function(done) {
      var thematicData = {
        thematic_id: "non-existing-thematic"
      };
      return thematicStore.createThematic(thematicData)
        .then(function(thematic) {
          thematic.should.be.an('object');
          should.exist(thematic.thematic_id);
          assert.equal(thematic.thematic_id, thematicData.thematic_id);
          done();
        });
    });

    it('should return empty title in new thematic record if it wasn\'t provided', function(done) {
      var thematicData = {
        parent_id: "4"
      };
      return thematicStore.createThematic(thematicData)
        .then(function(thematic) {
          thematic.should.be.an('object');
          should.exist(thematic.thematic_id);
          assert.equal(thematic.title, '');
          done();
        });
    });

    it('should return error if thematic with given thematic_id already exist', function(done) {
      var thematicData = {
        thematic_id: "1"
      };
      return thematicStore.createThematic(thematicData)
        .then(function(thematic) {
          should.not.exist(thematic);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Thematic ' + thematicData.thematic_id + ' already exists.');
          done();
        });
    });
  });

  describe('Get thematic', function() {
    it('should return thematic record with given id', function(done) {
      var thematicId = '1';
      return thematicStore.getThematic(thematicId)
        .then(function(thematic) {
          thematic.should.be.an('object');
          assert.equal(thematic.thematic_id, thematicId);
          done();
        });
    });

    it('should return error if thematicId with given id does not exist', function(done) {
      var thematicId = 'non-existing-thematic';
      return thematicStore.getThematic(thematicId)
        .then(function(thematic) {
          should.not.exist(thematic);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No thematic found for thematic_id ' + thematicId);
          done();
        });
    });
  });

  describe('Update thematic', function() {
    it('should update thematic and return updated record', function(done) {
      var thematicId = '1';
      var data = {
        title: 'Test thematic'
      };

      return thematicStore.updateThematic(thematicId, data)
        .then(function(thematic) {
          should.exist(thematic);
          thematic.should.be.an('object');
          assert.equal(thematic.thematic_id, thematicId);
          assert.equal(thematic.title, data.title);
          return thematicStore.getThematic(thematicId);
        })
        .then(function(thematic) {
          should.exist(thematic);
          thematic.should.be.an('object');
          assert.equal(thematic.thematic_id, thematicId);
          assert.equal(thematic.title, data.title);
          done();
        });
    });
  });

  describe('Delete thematic', function() {
    it('should delete thematic and return deleted record for a last time', function(done) {
      var thematicId = '4';

      return thematicStore.deleteThematic(thematicId)
        .then(function(thematic) {
          should.exist(thematic);
          thematic.should.be.an('object');
          assert.equal(thematic.thematic_id, thematicId);
          return thematicStore.getThematic(thematicId);
        })
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No thematic found for thematic_id ' + thematicId);
          done();
        });
    });

    it('should return error in case of non-existing record', function(done) {
      var thematicId = 'non-existing-thematic';

      return thematicStore.deleteThematic(thematicId)
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Thematic with thematic_id ' + thematicId + ' does not exists');
          done();
        });
    });
  });

  describe('Thematic existance', function() {
    it('should return true in case of existed record', function(done) {
      var thematicId = '1';

      return thematicStore.thematicExists(thematicId)
        .then(function(exist) {
          assert.equal(exist, true);
          done();
        });
    });

    it('should return false in case of existed record', function(done) {
      var thematicId = 'non-existing-thematic';

      return thematicStore.thematicExists(thematicId)
        .then(function(exist) {
          assert.equal(exist, false);
          done();
        });
    });
  });
});
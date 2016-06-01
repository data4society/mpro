var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var RubricStore = require('../../server/RubricStore');

describe('Rubric Store', function() {
  var db = new Database();

  var rubricStore = new RubricStore({db: db});

  // we have to shutdown db connection and establish it again one time
  // so massive will have all methods attached to it's DB object
  // if we will not do it massive will not have methods atatched to table
  // because there was no tables when we started first unit test
  before(function(done) {
    db.reset()
      .then(function() {
        var rubricStore = new RubricStore({ db: db });
        return rubricStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();
        rubricStore = new RubricStore({db: db});
        
        done();
      });
  });

  beforeEach(function(done) {
    db.reset()
      .then(function() {
        var rubricStore = new RubricStore({ db: db });
        return rubricStore.seed();
      }).then(done);
  });

  describe('Create rubric', function() {
    it('should return new rubric record with given data', function(done) {
      var rubricData = {
        title: 'Test',
        parent_id: '3'
      };
      return rubricStore.createRubric(rubricData)
        .then(function(rubric) {
          rubric.should.be.an('object');
          should.exist(rubric.rubric_id);
          assert.equal(rubric.title, rubricData.title);
          assert.equal(rubric.parent_id, rubricData.parent_id);
          done();
        });
    });

    it('should return new rubric record with given id', function(done) {
      var rubricData = {
        rubric_id: "non-existing-rubric"
      };
      return rubricStore.createRubric(rubricData)
        .then(function(rubric) {
          rubric.should.be.an('object');
          should.exist(rubric.rubric_id);
          assert.equal(rubric.rubric_id, rubricData.rubric_id);
          done();
        });
    });

    it('should return empty title in new rubric record if it wasn\'t provided', function(done) {
      var rubricData = {
        parent_id: "4"
      };
      return rubricStore.createRubric(rubricData)
        .then(function(rubric) {
          rubric.should.be.an('object');
          should.exist(rubric.rubric_id);
          assert.equal(rubric.title, '');
          done();
        });
    });

    it('should return error if rubric with given rubric_id already exist', function(done) {
      var rubricData = {
        rubric_id: "1"
      };
      return rubricStore.createRubric(rubricData)
        .then(function(rubric) {
          should.not.exist(rubric);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Rubric ' + rubricData.rubric_id + ' already exists.');
          done();
        });
    });
  });

  describe('Get rubric', function() {
    it('should return rubric record with given id', function(done) {
      var rubricId = '1';
      return rubricStore.getRubric(rubricId)
        .then(function(rubric) {
          rubric.should.be.an('object');
          assert.equal(rubric.rubric_id, rubricId);
          done();
        });
    });

    it('should return error if rubricId with given id does not exist', function(done) {
      var rubricId = 'non-existing-rubric';
      return rubricStore.getRubric(rubricId)
        .then(function(rubric) {
          should.not.exist(rubric);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No rubric found for rubric_id ' + rubricId);
          done();
        });
    });
  });

  describe('Update rubric', function() {
    it('should update rubric and return updated record', function(done) {
      var rubricId = '1';
      var data = {
        title: 'Test rubric'
      };

      return rubricStore.updateRubric(rubricId, data)
        .then(function(rubric) {
          should.exist(rubric);
          rubric.should.be.an('object');
          assert.equal(rubric.rubric_id, rubricId);
          assert.equal(rubric.title, data.title);
          return rubricStore.getRubric(rubricId);
        })
        .then(function(rubric) {
          should.exist(rubric);
          rubric.should.be.an('object');
          assert.equal(rubric.rubric_id, rubricId);
          assert.equal(rubric.title, data.title);
          done();
        });
    });
  });

  describe('Delete rubric', function() {
    it('should delete rubric and return deleted record for a last time', function(done) {
      var rubricId = '4';

      return rubricStore.deleteRubric(rubricId)
        .then(function(rubric) {
          should.exist(rubric);
          rubric.should.be.an('object');
          assert.equal(rubric.rubric_id, rubricId);
          return rubricStore.getRubric(rubricId);
        })
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No rubric found for rubric_id ' + rubricId);
          done();
        });
    });

    it('should return error in case of non-existing record', function(done) {
      var rubricId = 'non-existing-rubric';

      return rubricStore.deleteRubric(rubricId)
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Rubric with rubric_id ' + rubricId + ' does not exists');
          done();
        });
    });
  });

  describe('Rubric existance', function() {
    it('should return true in case of existed record', function(done) {
      var rubricId = '1';

      return rubricStore.rubricExists(rubricId)
        .then(function(exist) {
          assert.equal(exist, true);
          done();
        });
    });

    it('should return false in case of non-existed record', function(done) {
      var rubricId = 'non-existing-rubric';

      return rubricStore.rubricExists(rubricId)
        .then(function(exist) {
          assert.equal(exist, false);
          done();
        });
    });
  });
});
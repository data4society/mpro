var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var UserStore = require('../../server/UserStore');

describe('Donor Store', function() {
  var db = new Database();

  var userStore = new UserStore({db: db});

  // we have to shutdown db connection and establish it again one time
  // so massive will have all methods attached to it's DB object
  // if we will not do it massive will not have methods atatched to table
  // because there was no tables when we started first unit test
  before(function(done) {
    db.reset()
      .then(function() {
        var userStore = new UserStore({ db: db });
        return userStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();
        userStore = new UserStore({db: db});
        
        done();
      });
  });

  beforeEach(function(done) {
    db.reset()
      .then(function() {
        var userStore = new UserStore({ db: db });
        return userStore.seed();
      }).then(done);
  });

  describe('Get user', function() {
    it('should return user record', function(done) {
      var userId = 'testuser';
      return userStore.getUser(userId)
        .then(function(user) {
          user.should.be.an('object');
          assert.equal(user.user_id, userId);
          done();
        });
    });
  });

});
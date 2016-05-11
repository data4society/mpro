var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var UserStore = require('../../server/UserStore');

describe('Donor Store', function() {
  var db = new Database();

  var userStore = new UserStore({db: db});

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
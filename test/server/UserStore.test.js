var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var UserStore = require('../../server/UserStore');

describe('User Store', function() {
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

  describe('Create user', function() {
    it('should return new user record with given data', function(done) {
      var userData = {
        email: "test-user@example.com",
        name: "Test"
      };
      return userStore.createUser(userData)
        .then(function(user) {
          user.should.be.an('object');
          should.exist(user.user_id);
          assert.equal(user.email, userData.email);
          assert.equal(user.name, userData.name);
          done();
        });
    });

    it('should return new user record with given id', function(done) {
      var userData = {
        user_id: "non-existing-user"
      };
      return userStore.createUser(userData)
        .then(function(user) {
          user.should.be.an('object');
          should.exist(user.user_id);
          assert.equal(user.user_id, userData.user_id);
          done();
        });
    });

    it('should return empty name in new user record if it wasn\'t provided', function(done) {
      var userData = {
        email: "test-user@example.com"
      };
      return userStore.createUser(userData)
        .then(function(user) {
          user.should.be.an('object');
          should.exist(user.user_id);
          assert.equal(user.name, '');
          done();
        });
    });

    it('should return error if user with given user_id already exist', function(done) {
      var userData = {
        user_id: "testuser"
      };
      return userStore.createUser(userData)
        .then(function(user) {
          should.not.exist(user);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'User ' + userData.user_id + ' already exists.');
          done();
        });
    });

    it('should return error if user with given email already exist', function(done) {
      var userData = {
        email: "test@example.com"
      };
      return userStore.createUser(userData)
        .then(function(user) {
          should.not.exist(user);
        }).catch(function(err) {
          should.exist(err);
          //assert.equal(err.message, 'User ' + userData.email + ' already exists.');
          done();
        });
    });
  });

  describe('Get user', function() {
    it('should return user record with given id', function(done) {
      var userId = 'testuser';
      return userStore.getUser(userId)
        .then(function(user) {
          user.should.be.an('object');
          assert.equal(user.user_id, userId);
          done();
        });
    });

    it('should return error if user with given id does not exist', function(done) {
      var userId = 'non-existing-user';
      return userStore.getUser(userId)
        .then(function(user) {
          should.not.exist(user);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No user found for user_id ' + userId);
          done();
        });
    });

    it('should return user record with given email', function(done) {
      var email = 'test@example.com';
      return userStore.getUserByEmail(email)
        .then(function(user) {
          user.should.be.an('object');
          assert.equal(user.email, email);
          done();
        });
    });

    it('should return error if user with given email does not exist', function(done) {
      var email = 'non-existing-email@example.com';
      return userStore.getUserByEmail(email)
        .then(function(user) {
          should.not.exist(user);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No user found with email ' + email);
          done();
        });
    });
  });

  describe('Update user', function() {
    it('should update user and return updated record', function(done) {
      var userId = 'testuser';
      var data = {
        name: 'Test user'
      };

      return userStore.updateUser(userId, data)
        .then(function(user) {
          should.exist(user);
          user.should.be.an('object');
          assert.equal(user.user_id, userId);
          assert.equal(user.name, data.name);
          return userStore.getUser(userId);
        })
        .then(function(user) {
          should.exist(user);
          user.should.be.an('object');
          assert.equal(user.user_id, userId);
          assert.equal(user.name, data.name);
          done();
        });
    });

    it('should update email of user and return updated record', function(done) {
      var userId = 'testuser';
      var email = 'test@example.com';
      var data = {
        email: 'new-email@example.com'
      };

      return userStore.getUserByEmail(email)
        .then(function(user) {
          should.exist(user);
          user.should.be.an('object');
          assert.equal(user.user_id, userId);
          return userStore.updateUser(userId, data);
        })
        .then(function(user) {
          should.exist(user);
          user.should.be.an('object');
          assert.equal(user.user_id, userId);
          assert.equal(user.email, data.email);
          return userStore.getUserByEmail(email);
        })
        .then(function(user) {
          should.not.exist(user);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No user found with email ' + email);
          done();
        });
    });
  });

  describe('Delete user', function() {
    it('should delete user and return deleted record for a last time', function(done) {
      var userId = 'testuser';

      return userStore.deleteUser(userId)
        .then(function(user) {
          should.exist(user);
          user.should.be.an('object');
          assert.equal(user.user_id, userId);
          return userStore.getUser(userId);
        })
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No user found for user_id ' + userId);
          done();
        });
    });

    it('should return error in case of non-existing record', function(done) {
      var userId = 'non-existing-user';

      return userStore.deleteUser(userId)
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'User with user_id ' + userId + ' does not exists');
          done();
        });
    });
  });

  describe('User existance', function() {
    it('should return true in case of existed record', function(done) {
      var userId = 'testuser';

      return userStore.userExists(userId)
        .then(function(exist) {
          assert.equal(exist, true);
          done();
        });
    });

    it('should return false in case of existed record', function(done) {
      var userId = 'non-existing-user';

      return userStore.userExists(userId)
        .then(function(exist) {
          assert.equal(exist, false);
          done();
        });
    });
  });
});
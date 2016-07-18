'use strict';

var substanceTest = require('substance/test/test').module('server/UserStore');

var Database = require('../../server/Database');
var UserStore = require('../../server/UserStore');

var db, userStore;

function setup() {
  db = new Database();
  return db.reset()
    .then(function() {
      userStore = new UserStore({db: db});
      return userStore.seed();
    }).then(function(){
      // we have to shutdown db connection and establish test again one time
      // so massive will have all methods attached to test's DB object
      // if we will not do test massive will not have methods atatched to table
      // because there was no tables when we started first unit test
      db.connection.end();
      db = new Database();
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
  Create user
*/

test('Should return new user record with given data', function(t) {
  var userData = {
    email: "test-user@example.com",
    name: "Test"
  };
  return userStore.createUser(userData)
    .then(function(user) {
      t.isNotNil(user.user_id, 'User user_id should exists');
      t.equal(user.email, userData.email, 'User email should equals email from arguments');
      t.equal(user.name, userData.name, 'User name should equals name from arguments');
      t.end();
    });
});

test('Should return new user record with given id', function(t) {
  var userData = {
    user_id: "non-existing-user"
  };
  return userStore.createUser(userData)
    .then(function(user) {
      t.isNotNil(user.user_id, 'User user_id should exists');
      t.equal(user.user_id, userData.user_id, 'User user_id should equals user_id from arguments');
      t.end();
    });
});

test('Should return empty name in new user record if it wasn\'t provided', function(t) {
  var userData = {
    email: "test-user@example.com"
  };
  return userStore.createUser(userData)
    .then(function(user) {
      t.isNotNil(user.user_id, 'User user_id should exists');
      t.equal(user.name, '', 'User name should equals empty string');
      t.end();
    });
});

test('Should return error if user with given user_id already exist', function(t) {
  var userData = {
    user_id: "testuser"
  };
  return userStore.createUser(userData)
    .then(function(user) {
      t.isNil(user, 'User should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'User ' + userData.user_id + ' already exists.', 'Error message should equals to given one');
      t.end();
    });
});

test('Should return error if user with given email already exist', function(t) {
  var userData = {
    email: "test@example.com"
  };
  return userStore.createUser(userData)
    .then(function(user) {
      t.isNil(user, 'User should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.name, 'UserStore.CreateError', 'Error name should equals to given one');
      t.end();
    });
});

/*
  Get user
*/

test('Should return user record with given id', function(t) {
  var userId = 'testuser';
  return userStore.getUser(userId)
    .then(function(user) {
      t.equal(user.user_id, userId, 'User user_id should equals userId from arguments');
      t.end();
    });
});

test('Should return error if user with given id does not exist', function(t) {
  var userId = 'non-existing-user';
  return userStore.getUser(userId)
    .then(function(user) {
      t.isNil(user, 'User should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No user found for user_id ' + userId, 'Error message should equals to given one');
      t.end();
    });
});

test('Should return user record with given email', function(t) {
  var email = 'test@example.com';
  return userStore.getUserByEmail(email)
    .then(function(user) {
      t.equal(user.email, email, 'User email should equals email from arguments');
      t.end();
    });
});

test('Should return error if user with given email does not exist', function(t) {
  var email = 'non-existing-email@example.com';
  return userStore.getUserByEmail(email)
    .then(function(user) {
      t.isNil(user, 'User should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No user found with email ' + email, 'Error message should equals to given one');
      t.end();
    });
});

/*
  Update user
*/

test('Should update user and return updated record', function(t) {
  var userId = 'testuser';
  var data = {
    name: 'Test user'
  };

  return userStore.updateUser(userId, data)
    .then(function(user) {
      t.isNotNil(user, 'User should exists');
      t.equal(user.user_id, userId, 'User user_id should equals userId from arguments');
      t.equal(user.name, data.name, 'User name should equals name from arguments');
      return userStore.getUser(userId);
    })
    .then(function(user) {
      t.isNotNil(user, 'User should exists');
      t.equal(user.user_id, userId, 'User user_id should equals userId from arguments');
      t.equal(user.name, data.name, 'User name should equals name from arguments');
      t.end();
    });
});

test('Should update email of user and return updated record', function(t) {
  var userId = 'testuser';
  var email = 'test@example.com';
  var data = {
    email: 'new-email@example.com'
  };

  return userStore.getUserByEmail(email)
    .then(function(user) {
      t.isNotNil(user, 'User should exists');
      t.equal(user.user_id, userId, 'User user_id should equals userId from arguments');
      return userStore.updateUser(userId, data);
    })
    .then(function(user) {
      t.isNotNil(user, 'User should exists');
      t.equal(user.user_id, userId, 'User user_id should equals userId from arguments');
      t.equal(user.email, data.email, 'User email should equals email from arguments');
      return userStore.getUserByEmail(email);
    })
    .then(function(user) {
      t.isNil(user, 'User should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No user found with email ' + email, 'Error message should equals to given one');
      t.end();
    });
});

/*
  Delete user
*/

test('Should delete user and return deleted record for a last time', function(t) {
  var userId = 'testuser';

  return userStore.deleteUser(userId)
    .then(function(user) {
      t.isNotNil(user, 'User should exists');
      t.equal(user.user_id, userId, 'User user_id should equals userId from arguments');
      return userStore.getUser(userId);
    })
    .catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No user found for user_id ' + userId, 'Error message should equals to given one');
      t.end();
    });
});

test('Should return error in case of non-existing record', function(t) {
  var userId = 'non-existing-user';

  return userStore.deleteUser(userId)
    .catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'User with user_id ' + userId + ' does not exists', 'Error message should equals to given one');
      t.end();
    });
});

/*
  User existance
*/

test('Should return true in case of existed record', function(t) {
  var userId = 'testuser';

  return userStore.userExists(userId)
    .then(function(exist) {
      t.equal(exist, true, 'User should exists');
      t.end();
    });
});

test('Should return false in case of non-existed record', function(t) {
  var userId = 'non-existing-user';

  return userStore.userExists(userId)
    .then(function(exist) {
      t.equal(exist, false, 'User should not exists');
      t.end();
    });
});
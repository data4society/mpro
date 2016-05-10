'use strict';

var oo = require('substance/util/oo');
var massive = require('massive');
var config = require('config');

/*
  Implements Database Conection API.
*/
function Database() {
  this.connect();
}

Database.Prototype = function() {

  /*
    Connect to the db
  */
  this.connect = function() {
    this.db_url = config.get('db_url');
    if (!this.db_url) {
      throw new Error('Could not find db connection string');
    }
    this.connection = massive.connectSync({connectionString: this.db_url});
  };

  /*
    Wipe DB and run lagtest migartion

    @param {Function} cb callback
  */
  this.reset = function(cb) {
    this.connection.reset(function(err){
      if (err) {
        console.log(err.stack);
        process.exit(1);
      }
      cb(null);
    });
  };

};

oo.initClass(Database);

module.exports = Database;

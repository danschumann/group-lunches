var
  ensureTable, fetch, filterPending, runPending, rollback,

  Migration, Migrations, migrate, createTable,

  tableName = 'migrations',

  when      = require('when'),
  keys      = require('when/keys'),
  sequence  = require('when/sequence'),
  join      = require('path').join,
  bookshelf = require('../models/base'),
  _         = require('underscore'),
  fs        = require('final-fs'),
  pm        = require('print-messages');


Migration   = bookshelf.Model.extend({

  tableName: tableName,

  permittedAttributes: [
    'id',
    'filename'
  ],

});

Migrations  = bookshelf.Collection.extend({ model: Migration });

_.extend(Migrations, {

  migrate: function(command, options){

    options = options || {};
    return Migrations.ensureTable()
    .then(Migrations.fetchAll)
    .then(function(fetchResults){

      if ( command == 'rollback' )
        return Migrations.rollback(fetchResults.migrations, options);

      else if ( command == 'migrate' || !command )
        return Migrations.runPending(Migrations.filterPending(fetchResults), options);
    });

  },

  ensureTable: function(){

    return bookshelf.knex.schema.hasTable(tableName).then(function(exists){
      if ( !exists ) {
        pm.log('Creating Migrations Table...');
        return bookshelf.schema.createTable(tableName, function(table){

          table.increments('id').unique().primary();
          // filename should be ISO string -- description == '2013-11-30T14-48-34.465Z'
          // note dashes instead of colons in time, file system likes that
          table.string('filename').unique().notNullable();

        });
      }
    });

  },

  // We need to know all the migrations that need to be ran, and which ones were already ran
  fetchAll: function(){
    var migrations;

    return keys.all({

      // All migrations in directory
      filenames:
        fs.readdir(join(__dirname, '/migrations')),

      // Previously completed migrations saved in database
      migrations:
        (migrations = new Migrations).fetch().then(function(){
          return migrations.pluck('filename')
        })

    });
  },

  rollback: function(migrationFilenames, options){

    options.step = options.step || 1;
    downs = []
    while(migrationFilenames.length > 0 && options.step-- > 0){
      downs.push(Migrations.singleMigration(migrationFilenames.pop(), 'down'));
    };

    return sequence(downs);

  },

  filterPending: function(fetchResults) {
    return _.difference(fetchResults.filenames, fetchResults.migrations);
  },

  require: function(filename) {
    return require(join(__dirname, '/migrations', filename));
  },

  singleMigration: function(filename, direction) {
    return function(){

      var
        migration = Migrations.require(filename),
        pretty_direction = (direction == 'up' ? 'up'.green : 'down'.red),
        undoMigration = function(){
          console.log(('Saving Migration to ' + tableName + ' Failed!!!!!').red, migration.title, pretty_direction, arguments);
          // If we migrate successfully, but fail to save in migrations table
          // we have to undo the migration manually since it can't be in a transaction
          return migration[direction == 'up' ? 'down' : 'up'](bookshelf)
            .then(function(){
              throw new Error('Some migrations were successful, but we could not save them to the database'); 
            });
        };

      console.log('migration:'.magenta, pretty_direction, migration.title, filename.blue);


      // We do the migration
      return migration[direction](bookshelf)
      .then(function(){

        console.log('migration done:'.blue, pretty_direction, migration.title, direction.cyan, filename.blue);

        // save it to the database
        var record = Migration.forge({filename: filename})

        console.log('saving in migrations table..'.green, filename);
        if ( direction == 'up' )  {
          return record = record.save().otherwise(undoMigration);
        } else
          return record = record.fetch().then(function(model){
            return model.destroy();
          })
          .otherwise(undoMigration);

      });
          
    };

  },

  runPending: function(pending, options){
    if ( pending.length)
      pm.log('Running migrations...');

    pendingMigrations = _.compact(_.map(pending, function(filename, n){
      if ( !options.step || options.step > n )
        return Migrations.singleMigration(filename, 'up');
    }));

    // Sequence because migrations should be in order
    return sequence(pendingMigrations);

  }
});

module.exports = Migrations;

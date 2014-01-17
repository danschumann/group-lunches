// Top level entry point
require('./core/lib/bootstrap');

var
  Migrations = require('./core/data/migrations'),
  Core = require('./core');

Migrations.migrate()
  .then(function(){
    new Core;
  });

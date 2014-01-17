#!/usr/bin/env node

// Top level entry point
require('../core/lib/bootstrap');

var
  command,
  commands = ['rollback', 'migrate'],
  argv,
  _ = require('underscore'),
  Migrations = require('../core/data/migrations.js');

argv = require('optimist').argv;

command = argv._[0];

if ( command == 'redo' ) 
  // Clone so decrementing argv.step doesn't affect migrate
  Migrations.migrate('rollback', _.clone(argv))
  .then(function(){
    return Migrations.migrate('migrate', argv);
  })
  .then(function(){
    process.exit(0); 
  });
else if ( !command || _.include(commands, command) ) 
  Migrations.migrate(command, argv)
  .then(function(){
    process.exit(0); 
  });
else {
  console.log("Please supply a command", commands);
  console.log("If you meant to start the server, please run `node index.js` from the root directory(../)");
}

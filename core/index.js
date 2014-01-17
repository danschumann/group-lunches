var
  Core, core,
  _        = require('underscore'),
  join     = require('path').join,
  when     = require('when'),
  Server     = require('./server'),
  __slice  = [].slice;

Core = function(){

  if ( core ) return core;
  if (!(this instanceof Core)) return new Core;

  var server = new Server;
  server.listen()

  return core = this;

};

module.exports = Core;

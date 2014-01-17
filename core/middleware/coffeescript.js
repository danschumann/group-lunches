// Compiling coffeescripts and serving on the frontend

var
  coffeescript_middleware,
  coffeescript  = require('coffee-script'),
  loaddir  = require('loaddir');

// We load every stylesheet into memory and serve them only if that url gets hit
// options.src is all we care about for this version
coffeescript_middleware = function(options){

  var javascripts = {};

  loaddir({
    debug: true,
    fast_watch: true,

    path: options.src,

    compile: function(){
      return coffeescript.compile(this.fileContents);
    },

    callback: function(){
      var url_path = '/javascripts/' + this.relativePath + this.baseName + '.js';
      javascripts[url_path] = this.fileContents;
    },
  });

  return function(req, res, next){
    if (javascripts[req.url]){
      res.setHeader('content-type', 'text/javascript');
      res.end(javascripts[req.url]);
    } else
      next();
  }
}

module.exports = coffeescript_middleware;

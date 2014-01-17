var
  coffeecups = {},
  join = require('path').join,
  coffeecup = require('coffeecup'),
  loaddir = require('loaddir'),
  content = require('../lib/content'),
  config = require('../lib/config-loader'),
  _       = require('underscore');

loaddir({
  path: join(__dirname, '../views'),

  callback: function(){
    if ( _.last(this.fileName.split('.')) == 'coffee' ) {
      coffeecups[join(this.relativePath, this.baseName)] = coffeecup.compile(this.fileContents);
    };
  },
});

module.exports = function(req, res, next) {

  res.view = function(path, options){
    var defaults = {
      req: req,
      coffeecups: coffeecups,
      _: _,
      content: content,
      config: config,
    };
    res.render(path, _.extend(defaults, options));
  };

  next();

};

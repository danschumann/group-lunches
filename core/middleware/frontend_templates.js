// Frontend templates are compiled into 1 file
var
  output = '',
  cache = {},
  joinTemplates, repeat,
  join = require('path').join,
  coffeescript = require('coffee-script'),
  loaddir = require('loaddir'),
  _       = require('underscore');


loaddir({
  path: join(__dirname, '/../frontend/templates'),

  compile: function(){
    return coffeescript.compile(this.fileContents);
  },

  callback: function(){

    var
      dirStructure = '',
      template_str = '';

    _.each( this.relativePath.split('/'), function(dir, n){

      if ( _.isEmpty(dir) ) return;

      // We ensure the structure exists
      // window.template[topDir][nextDir] = window.template[topDir][nextDir] || {};
      dirStructure += '["' + dir + '"]';
      template_str += 'window.template' + dirStructure + ' = window.template' + dirStructure + ' || {};\n';

    });

    template_str += 'window.template' + dirStructure + '["' + this.baseName + '"] = coffeecup.compile(function(){';
    template_str += '\n  return ' + this.fileContents + '\n});';
    cache[this.path] = template_str;

    if (repeat) joinTemplates();
  },

});

repeat = true;
joinTemplates = function(){
  _.defer(function(){
    output = 'window.template = {};\n' + _(cache).values().join('');
  });
};

joinTemplates();

module.exports = function(req, res, next) {

  if (req.url == '/javascripts/templates.js'){
    res.setHeader('content-type', 'text/javascript');
    res.send(output);
  } else
    next()

};

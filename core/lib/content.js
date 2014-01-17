var
  join    = require('path').join;
  marked = require('marked'),
  coffee  = require('coffee-script');
  loaddir = require('loaddir');

module.exports = loaddir({
  path: join(__dirname, '..', 'data/content'),
  callback: function(){
    return marked(eval(coffee.compile(this.fileContents)));
  },
});

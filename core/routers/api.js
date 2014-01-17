var
  loaddir         = require('loaddir'),
  join            = require('path').join,
  when            = require('when'),
  pm              = require('print-messages'),
  _               = require('underscore'),

  // Middleware
  user            = require('../middleware/user')
  authentication  = require('../middleware/authentication')

  // Controllers
  controllers  = loaddir({
    path: join(__dirname, '..', 'controllers'),
    require: true,
  });

module.exports = function(app){

};

var
  router,
  loaddir         = require('loaddir'),
  join            = require('path').join,
  when            = require('when'),
  pm              = require('print-messages'),
  _               = require('underscore'),

  // Middleware
  user            = require('../middleware/user')
  authentication  = require('../middleware/authentication')

  adminControllers  = loaddir({
    path: join(__dirname, '..', 'controllers/admin'),
    require: true,
  });

module.exports = function(app){

  app.get  ('/admin', authentication.admin, adminControllers.index);

};

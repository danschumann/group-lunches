var
  config = require('../lib/config-loader');

module.exports = function(req, res, next) {

  req.locals = req.locals || {};

  next();

};

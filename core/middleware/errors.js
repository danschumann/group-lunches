var
  _ = require('underscore');

module.exports = function(req, res, next) {

  // We add methods to req to make pushing messages easier
  _.each(['error', 'notification'], function(method){

    var plural = method + 's';

    req.session[plural] = req.session[plural] || {};

    req[method] = function(messages, key){

      key = key || 'base';

      // We only set values when we have a string
      if (_.isString(messages)) {
        req.session[plural][key] = req.session[plural][key] || [];
        req.session[plural][key].push(messages);
      }

      // For every other type, we end up calling req[method] again
      
      // Only errors should have .message -- i.e. -- new Error('asdf')
      else if (messages.message)
        req.error(messages.message, key);

      else if (_.isObject(messages))
        _.each(messages, function(err, _key) {
          req.error(err, _key);
        });

      else if (_.isArray(messages))
        _.each(messages, function(err) {
          req.error(err, key);
        });

      else
        console.log('Unhandled error type!'.red, arguments);

      return req;

    };
  });

  next();

};

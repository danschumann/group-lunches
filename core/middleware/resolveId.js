module.exports = function(req, res, next) {

  // Finds the id of some sort of object without knowing what param it is set on
  req.resolveId = function(key, req) {
    var keyId = key + '_id'
    return (
      (req.session      && req.session[keyId]) ||
      (req.params       && req.params[keyId]) ||
      (req.query        && req.query[keyId]) ||
      (req.body         && req.body[keyId])
    );
  };

  next();
};

var
  User = require('../models/user').User;

module.exports = {

  index: function(req, res, next){
    res.view('account');
  },

  post: function(req, res, next){
    var checkboxes = ['notify_start_vote', 'notify_end_vote', 'notify_pickup'];

    var attributes = _.pick(req.body, 'first_name', 'last_name');

    _.each(checkboxes, function(key){
      attributes[key] = (req.body[key] == 'on')
    });

    req.locals.user.editAccount(attributes)
      .then(function(user){
        req.notification('You have successfully editted your account');
        res.redirect('/');
      })
      .otherwise(function(errors){
        req.error(errors);
        res.view('account', {body: req.body});
      });
  },

};

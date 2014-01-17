var
  User = require('../models/user').User;

module.exports = {

  index: function(req, res, next){
    res.view('account/password');
  },

  post: function(req, res, next){

    var attributes = _.pick(req.body, 'password', 'confirm_password');

    req.locals.user.checkPassword(req.body.current_password)
      .then(function(matches){
        console.log('match'.red, matches);
        if ( ! matches )
          req.locals.user.newError('current_password', 'Please enter your current password correctly')

        return req.locals.user.changePassword(attributes);
      })
      .then(function(user){
        req.notification('You have successfully editted your account');
        res.redirect('/');
      })
      .otherwise(function(errors){
        console.log('e', errors);
        req.error(errors);
        res.view('account/password', {body: req.body});
      });
  },

};

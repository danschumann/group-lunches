var
  when = require('when'),
  User = require('../models/user').User;

module.exports = {

  index: function(req, res, next){
    res.view('account/email');
  },

  post: function(req, res, next){

    var user = req.locals.user;

    var attributes = _.pick(req.body, 'email', 'confirm_email');

    when().then(function(){
      if (req.body.email == user.get('email'))
        user.newError('current_email', 'That email is the same as your current one')
      else
        return User.emailExists(req.body.email);
    })
    .then(function(exists){
      if (exists)
        user.newError('email', 'That email already exists');
      return user.changeEmail(attributes);
    })
    .then(function(user){
      req.notification('You have successfully changed your email');
      res.redirect('/');
    })
    .otherwise(function(errors){
      req.error(errors);
      res.view('account/email', {body: req.body});
    });
  },

};

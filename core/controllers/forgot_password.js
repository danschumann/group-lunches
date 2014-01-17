var
  forgot_password,
  User = require('../models/user').User;

forgot_password = {

  index: function(req, res, next){
    res.view('forgot_password');
  },

  post: function(req, res, next){

    var attributes = _.pick(req.body, 'username');

    User.forgot_password(attributes)
      .then(function(user){
        res.view('forgot_password_sent', {username: req.body.username});
      })
      .otherwise(function(errors){
        req.error(errors);
        res.view('forgot_password', {body: req.body});
      });
  },

};

module.exports = forgot_password;

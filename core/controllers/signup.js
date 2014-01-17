var
  User = require('../models/user').User;

module.exports = {

  index: function(req, res, next){
    res.view('signup');
  },

  post: function(req, res, next){

    var attributes = _.pick(req.body, 'first_name', 'last_name', 'username', 'password', 'confirm_username');

    User.signup(attributes)
      .then(function(user){
        req.session.user_id = user.get('id');
        res.redirect('/');
      })
      .otherwise(function(errors){
        req.error(errors);
        res.view('signup', {body: req.body});
      });
  },

};

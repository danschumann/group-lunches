var
  login,
  User = require('../models/user').User;

login = {

  index: function(req, res, next){
    res.view('login');
  },

  post: function(req, res, next){

    var attributes = _.pick(req.body, 'username', 'password');

    User.login(attributes)
      .then(function(user){
        req.session.user_id = user.get('id');
        req.session.admin = user.get('admin');
        res.redirect('/');
      })
      .otherwise(function(errors){
        req.error(errors);
        res.view('login', {body: req.body});
      });

  },

};

module.exports = login;

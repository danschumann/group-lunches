var
  login,
  _     = require('underscore'),
  User  = require('../models/user').User;

login = {

  index: function(req, res, next){
    res.view('reset_password');
  },

  post: function(req, res, next){

    var attributes = _.pick(req.body, 'password', 'confirm_password');

    if ( !req.locals.user || _.size(req.session.errors) )
      return res.view('reset_password');

    var user = req.locals.user;

    user
      .set(attributes)
      .check('password')
      .check('confirm_password');

    if ( user.hasError() ) {
      req.error( user.errors );
      return res.view('reset_password');
    };

    user.hashPassword()
    .then(function(){
      return user.save();
    })
    .then(function(){
      req.notification('You have updated your password');
      req.session.user_id = user.get('id');
      res.redirect('/');
    })
    .otherwise(function(errors){
      req.error(errors);
      res.view('reset_password');
    });

  },

};

module.exports = login;

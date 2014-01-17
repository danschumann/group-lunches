var
  User = require('../models/user').User;

module.exports = {

  // Ensures the password token is accurate before
  token: function(req, res, next){

    User.forge({id: req.query.user_id}).fetch()
    .then(function(user){
      console.log(user.get('password_token_expires'), (new Date).getTime());
      if (user.get('password_token') !== req.query.token)
        req.error('That token is not correct, please <a href="/forgot_password"> try again </a>', 'reset_password');

      else if ( user.get('password_token_expires') < (new Date).getTime() )
        req.error('That token has expired, please <a href="/forgot_password"> try again </a>.', 'reset_password');
      else
        // Remember user for POSTing a new password
        req.locals.user = user;

      next();
    })
    .otherwise(function(){
      req.error('Cannot get that user');
      next();
    });
  },

}

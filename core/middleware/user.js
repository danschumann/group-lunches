var
  User = require('../models/user').User;

module.exports = {

  // Only logged in users may be at this page
  load: function(req, res, next){
    // User Auth is at middleware/authentication
    if ( !req.session.user_id ) return next();

    User.forge({id: req.session.user_id}).fetch()
      .then(function(user){
        if ( !user ) {
          // For some reason they have a session that has an invalid user token
          delete req.session.user_id;
          return res.redirect('/');
        };
        req.locals.user = user;
        if (user.get('banned')) {
          req.error('You have been temporarilly banned for misuse, please try again later. ( HAHA )');
          delete req.session.user_id;
          return res.redirect('/');
        }
        next();
      })
      .otherwise(function(){
        delete req.session.user_id;
        req.error('You have been logged out, please log back in');
        res.redirect('/login');
      });
  },
};

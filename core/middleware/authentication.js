module.exports = {

  // Only logged in users may be at this page
  user: function(req, res, next){
    if ( req.session.user_id )
      next();
    else {
      console.log('this does run');
      req.error('Please log in before continuing');
      res.redirect('/login');
    };
  },

  // Only users that are not logged in may be at this page
  non: function(req, res, next){
    if ( req.session.user_id )
      res.redirect('/');
    else
      next();
  },

  admin: function(req, res, next){
    console.log(req.session);
    if ( !req.session.admin )
      res.redirect('/');
    else
      next();
  },

};

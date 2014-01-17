var
  LunchRestaurants = require('../models/lunch_restaurant').Restaurants,
  Lunches = require('../models/lunch').Lunches,
  Lunch  = require('../models/lunch').Lunch,
  base;

base = {
  index: function(req, res, next){
    if (req.locals.user && !req.locals.user.get('email')) {
      req.notification("Please set the email you'd like to receive updates from");
      res.redirect('/email');
    } else if (req.locals.user && !req.locals.user.get('first_name')) {
      req.notification("Please set your name");
      res.redirect('/account');
    } else if ( req.session.user_id ){
      console.log('heyo'.rainbow)

      Lunches.forge().fetch({withRelated: ['restaurants', 'restaurant']})
      .then(function(lunches){
        res.view('home', {lunches: lunches});
      });
    } else
      res.view('base/index');
  }
};

module.exports = base;

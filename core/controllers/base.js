var
  LunchRestaurants = require('../models/lunch_restaurant').Restaurants,
  Lunches = require('../models/lunch').Lunches,
  Lunch  = require('../models/lunch').Lunch,
  base;

require('../lib/mysql_date_format');

base = {
  index: function(req, res, next){
    if (req.locals.user && !req.locals.user.get('email')) {

      req.notification("Please set the email you'd like to receive updates from");
      res.redirect('/email');

    } else if (req.locals.user && !req.locals.user.get('first_name')) {

      req.notification("Please set your name");
      res.redirect('/account');

    } else if ( req.session.user_id ){
      //
      // Home 
      //
      cutoff = new Date
      cutoff.setHours(cutoff.getHours() - 8)
      Lunches.forge().query('where', 'created_at', '>', cutoff.toMysqlFormat())
      .fetch({withRelated: ['restaurants', 'restaurant', 'user']})
      .then(function(lunches){
        console.log(lunches);
        res.view('home', {lunches: lunches});
      });
    } else
      res.view('base/index');
  }
};

module.exports = base;

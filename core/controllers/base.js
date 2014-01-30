var
  _                 = require('underscore'),
  bookshelf         = require('../models/base'),
  LunchRestaurants  = require('../models/lunch_restaurant').Restaurants,
  Votes             = require('../models/vote').Votes,
  Lunches           = require('../models/lunch').Lunches,
  Lunch             = require('../models/lunch').Lunch,
  nodefn            = require('when/node/function'),
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
      cutoff = new Date;
      cutoff.setHours(cutoff.getHours() - 8);
      var lunches = Lunches.forge();

      lunches.query('where', 'created_at', '>', cutoff.toMysqlFormat())
      .fetch({withRelated: ['restaurants', 'restaurant', 'user']})
      .then(function(){
        var lunch_restaurant_ids = _.uniq(_.flatten(lunches.map(function(lunch){
          return lunch.related('restaurants').map(function(restaurant){
            return restaurant.pivot.id
          });
        })));
        return bookshelf.knex.raw(
          'select * from votes where user_id = ? and lunch_restaurant_id in (?)', 
          [req.session.user_id, lunch_restaurant_ids]
        );
      })
      .then(function(results){
        res.view('home', {lunches: lunches, votes: results[0]});
      });
    } else
      res.view('base/index');
  }
};

module.exports = base;

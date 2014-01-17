var
  bookshelf = require('../models/base'),
  Restaurants = require('../models/restaurant').Restaurants,
  LunchRestaurant  = require('../models/lunch_restaurant').LunchRestaurant,
  Vote  = require('../models/vote').Vote;

module.exports = {

  create: function(req, res, next){
    var vote =
      Vote.forge({user_id: req.session.user_id, lunch_restaurant_id: req.body.lunch_restaurant_id});

    vote.fetch().then(function(){
      if (vote.id)
        req.error('You already voted for that');
      else
        return vote.save().then(function(){
          return LunchRestaurant.forge({id: req.body.lunch_restaurant_id}).fetch()
        })
        .then(function(lr){
          console.log('hmmm', lr);
          lr.set('votes', lr.get('votes') + 1).save()
        });
    })
    .then(function(){
      res.redirect('/')
    })
  },

};

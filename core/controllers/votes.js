var
  bookshelf = require('../models/base'),
  Restaurants = require('../models/restaurant').Restaurants,
  LunchRestaurant  = require('../models/lunch_restaurant').LunchRestaurant,
  Vote  = require('../models/vote').Vote;

module.exports = {

  create: function(req, res, next){

    var lr,
    backURL = req.header('Referer').split('#')[0],

    vote =
      Vote.forge({user_id: req.session.user_id, lunch_restaurant_id: req.body.lunch_restaurant_id});

    // Check existing
    vote.fetch().then(function(){

      // Fetch this so we can update totals next step
      return LunchRestaurant.forge({id: req.body.lunch_restaurant_id}).fetch()
    })

    .then(function(_lr) {
      // keep a reference for the next callback
      lr = _lr

      // Already created
      if (vote.id) {

        // HACK: We use javascript to move this error 
        req.error('<script src="/javascripts/already_voted_error.js" data-already_voted="' + parseInt(req.body.lunch_restaurant_id) + '" ></script>');
      } else {
        req.notification('Successfully saved vote');

        // Save everything
        return when.map([vote.save(), lr.set('votes', lr.get('votes') + 1).save()])
      }
    })
    .then(function(){

      // Redirect them back, but include a hash in case they're on the index page
      res.redirect(backURL + '#lunch' + lr.get('lunch_id'))

    })
  },

};

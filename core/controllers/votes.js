var
  sequence = require('when/sequence'),
  bookshelf = require('../models/base'),
  Restaurants = require('../models/restaurant').Restaurants,
  LunchRestaurant  = require('../models/lunch_restaurant').LunchRestaurant,
  Votes  = require('../models/vote').Votes,
  Vote  = require('../models/vote').Vote;

module.exports = {

  index: function(req, res, next){

    if (!req.query.lunch_restaurant_id) {
      req.error('You must supply a GET param of lunch_restaurant_id')
      return res.redirect('/')
    }
    Votes.forge()
    .query({where: {lunch_restaurant_id: req.query.lunch_restaurant_id}})
    .fetch({withRelated: ['user']})
    .then(function(votes){
      res.view('votes/index', {votes: votes});
    });

  },

  create: function(req, res, next){

    var lr,
    backURL = (req.header('Referer') || '/lunches/' + req.params.lunch_id).split('#')[0],

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

        if (req.body.unvote) {
          req.notification('Successfully removed vote');
          return sequence([
            _.bind(vote.destroy, vote),
            _.bind(lr.calculateVotes, lr)
          ])
        } else {
          // HACK: We use javascript to move this error 
          return req.error('<script src="/javascripts/already_voted_error.js" data-already_voted="' + parseInt(req.body.lunch_restaurant_id) + '" ></script>');
        }
      }

      req.notification('Successfully saved vote');

      // Save everything
      return sequence([
        _.bind(vote.save, vote),
        _.bind(lr.calculateVotes, lr)
      ])
    })
    .then(function(){

      // Redirect them back, but include a hash in case they're on the index page
      res.redirect(backURL + '#lunch' + lr.get('lunch_id'))

    })
  },

};

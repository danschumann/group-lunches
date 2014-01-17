var
  Restaurants = require('../models/restaurant').Restaurants,
  Restaurant  = require('../models/restaurant').Restaurant;

module.exports = {

  index: function(req, res, next){

    Restaurants.forge().fetch().then(function(restaurants){
      console.log('restaurants', restaurants)
      res.view('restaurants', {restaurants: restaurants});
    });
  },

  create: function(req, res, next){
    var attributes = _.pick(req.body, 'name', 'menu_url', 'notes');

    _.each(attributes, function(val, key){
      attributes[key] = _.escape(val);
    });

    Restaurant.forge(attributes).sanitize().save()
    .then(function(restaurant){
      if (restaurant.id)
        req.notification('Saved ' + attributes.name);
      else
        req.error('Did not save ' + attributes.name);
      res.redirect('/restaurants')
    });

  },

  edit: function(req, res, next){

    if (req.params.restaurant_id)
      Restaurant.forge({id: req.params.restaurant_id}).fetch()
        .then(function(restaurant){
          res.view('restaurants/edit', {restaurant: restaurant.toJSON()});
        })
    else
      res.view('restaurants/edit');

  },

  update: function(req, res, next){
    var attributes = _.pick(req.body, 'name', 'menu_url', 'notes');

    _.each(attributes, function(val, key){
      attributes[key] = _.escape(val);
    });

    Restaurant.forge({id: req.params.restaurant_id}).fetch()
    .then(function(restaurant){
      return restaurant.set(attributes).sanitize().save()
    })
    .then(function(restaurant){
      if (restaurant.id)
        req.notification('Saved ' + attributes.name);
      else
        req.error('Did not save ' + attributes.name);
      res.redirect('/restaurants')
    });

  },

};

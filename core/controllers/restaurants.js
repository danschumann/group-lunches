var
  restaurantController,
  RestaurantNotification = require('../models/restaurant_notification').RestaurantNotification,
  Restaurants = require('../models/restaurant').Restaurants,
  Restaurant  = require('../models/restaurant').Restaurant;

restaurantController = {

  index: function(req, res, next){

    Restaurants.forge().fetch({withRelated: [
      {notifications: function(qb) { qb.where('user_id', req.session.user_id); }},
    ]}).then(function(restaurants){
      console.log('restaurants', restaurants)
      res.view('restaurants', {restaurants: restaurants});
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

  // Used by create and update
  validate: function(req, res, next){

    var attributes = _.pick(req.body, 'name', 'menu_url', 'notes');

    var restaurant = Restaurant.forge(attributes)

    if (!req.locals.user.get('admin'))
      restaurant.newError('base', 'Only admins can edit/update restaurants');

    restaurant.validate()
    if (restaurant.hasError()){
      req.error(restaurant.errors);
      module.exports.edit.apply(this, arguments);
      return true
    }
  },

  create: function(req, res, next){
    var attributes = _.pick(req.body, 'name', 'menu_url', 'notes');

    if ( restaurantController.validate.apply(this,arguments) ) return;
      
    var restaurant = Restaurant.forge(attributes)

    restaurant.sanitize().save()
    .then(function(restaurant){
      if (restaurant.id)
        req.notification('Saved ' + attributes.name);
      else
        req.error('Did not save ' + attributes.name);
      res.redirect('/restaurants')
    });

  },

  update: function(req, res, next){
    var attributes = _.pick(req.body, 'name', 'menu_url', 'notes');

    if ( restaurantController.validate.apply(this, arguments) ) return;

    Restaurant.forge({id: req.params.restaurant_id}).fetch()
    .then(function(restaurant){
      return restaurant.set(attributes).sanitize().save()
    })
    .then(function(restaurant){
      res.redirect('/restaurants')
    });

  },

  notify: function(req, res, next){
    
    var rn = RestaurantNotification.forge({
      restaurant_id: req.params.restaurant_id,
      user_id: req.session.user_id,
    });

    rn.fetch().then(function(){
      console.log(rn.id, req.body.notify);
      if (!rn.id && req.body.notify == 'true')
        return rn.save()
      else if( rn.id && req.body.notify !== 'true')
        return rn.destroy()
    })
    .then(function(){
      res.send();
    })

  },

};

module.exports = restaurantController;

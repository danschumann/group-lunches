var
  bookshelf = require('../models/base'),
  Restaurants = require('../models/restaurant').Restaurants,
  RestaurantNotification = require('../models/restaurant_notification').RestaurantNotification,
  RestaurantNotifications = require('../models/restaurant_notification').RestaurantNotifications,
  LunchRestaurant  = require('../models/lunch_restaurant').LunchRestaurant,
  Users = require('../models/user').Users,
  Lunches = require('../models/lunch').Lunches,
  Food = require('../models/food').Food,
  Orders = require('../models/order').Orders,
  Order = require('../models/order').Order,
  Lunch  = require('../models/lunch').Lunch;

module.exports = {

  create: function(req, res, next){

    var attributes = { name: _.escape(req.body.name), user_id: req.session.user_id }

    if (!attributes.name) attributes.name = 'untitled';

    if (!req.body.restaurant_id || !_.size(req.body.restaurant_id)) {
      req.error('You must pick at least one restaurant');
      return res.redirect('back')
    }

    if (_.size(req.body.restaurant_id) == 1)
      attributes.restaurant_id = _.keys(req.body.restaurant_id)[0].substring(1)

    var lunch = Lunch.forge(attributes);
    lunch.save()
    .then(function(){
      if (lunch.get('restaurant_id'))
        lunch.load('restaurant')
    })
    .then(function(){
      if (lunch && lunch.id) {
        req.notification('Created new lunch');
        return lunch.setupVoting(req.body.restaurant_id);
      };
    })
    .then(function(){
      res.redirect('/')
    })

  },

  show: function(req, res, next) {

    var lunch, orders;

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['restaurant', 'restaurants', 'comments', 'comments.user']})
    .then(function(_lunch){
      lunch = _lunch;
      return Orders.forge().query({where: {lunch_id: req.params.lunch_id}}).fetch({withRelated: ['foods', 'user']});
    })
    .then(function(_orders){
      orders = _orders;
      var lunch_restaurant_ids = lunch.related('restaurants').map(function(restaurant){
        return restaurant.pivot.id
      });
      if (lunch_restaurant_ids.length){
        return bookshelf.knex.raw(
          'select * from votes where user_id = ? and lunch_restaurant_id in (?)', 
          [req.session.user_id, lunch_restaurant_ids]
        );
      }
    })
    .then(function(results){
      res.view('lunches/show', {orders: orders, lunch: lunch, votes: results && results[0]});
    });

  },

  edit: function(req, res, next) {

    var users, restaurants;

    Users.forge().fetch()
    .then(function(_users){
      users = _users;
      return Restaurants.forge().fetch();
    })
    .then(function(_restaurants){
      restaurants = _restaurants;
      if (req.params.lunch_id)
        return Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['lunch_restaurants']})
    })
    .then(function(lunch){
      res.view('lunches/edit', {lunch: lunch, restaurants: restaurants, users: users});
    });

  },

  update: function(req, res, next) {
    var attributes = _.pick(req.body, 'name', 'user_id');

    _.each(attributes, function(val, key){
      attributes[key] = _.escape(val);
    });

    if (!attributes.name) attributes.name = 'untitled';

    var restaurant_ids = _.map(_.keys(req.body.restaurant_id || {}), function(id){
      return parseInt(id.substring(1));
    });

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['lunch_restaurants']})
    .then(function(lunch){
      if ( lunch.get('user_id') == req.session.user_id || req.locals.user.get('admin') )
        return lunch.set(attributes).save()
      else {
        req.error('You must be the owner of this to edit it');
        return when.reject();
      }
    })
    .then(function(lunch){
      lunch.related('lunch_restaurants').map(function(lr){
        if (!_.include(restaurant_ids, lr.get('restaurant_id')))
          lr.destroy()
        return lunch;
      })
      return lunch;
    })
    .then(function(lunch){
      _.each(restaurant_ids, function(id){
        if ( !lunch.related('lunch_restaurants').findWhere({restaurant_id: id}) )
          return LunchRestaurant.forge({
            votes: 0,
            restaurant_id: id,
            lunch_id: lunch.id
          }).save()
      });
      req.notification('Saved ' + attributes.name);
      res.redirect('/')
    })
    .otherwise(function(){
      res.redirect('back');
    });

  },

  close: function(req, res, next) {

    var emailedIds = [],
    lunch;

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['restaurant', 'users']})
    .then(function(_lunch){
      lunch = _lunch;

      // Access
      if (lunch.get('user_id') !== req.session.user_id && !req.locals.user.get('admin'))
        req.error('You must be the lunch owner to close the order');
      else {
        lunch.related('users').each(function(user){
          if (user.get('notify_pickup'))
            user.mailers.notifyClosed(lunch);
        });
        return lunch.set('closed', true).save()
      }
    })
    .then(function(){
      res.redirect('/lunches/' + lunch.id + '/orders');
    });
  },

  tally: function(req, res, next) {

    var emailedIds = [],
    lunch = Lunch.forge({id: req.params.lunch_id});

    lunch.fetch({withRelated: ['restaurants']})
    .then(function(){

      // Access
      if (lunch.get('user_id') !== req.session.user_id && !req.locals.user.get('admin')) {
        req.error('You must be the lunch owner to tally the votes');
        return when.reject()
      };

      // Find winner
      var winning = {id: [], votes: -1};
      lunch.related('restaurants').each(function(restaurant){
        if (restaurant.pivot.get('votes') == winning.votes) {
          winning.id.push(restaurant.id);
        } else if (restaurant.pivot.get('votes') > winning.votes) {
          winning.id = [restaurant.id];
          winning.votes = restaurant.pivot.get('votes');
        };
      });
      // Picks a random id of all the ones that tied for top place
      var winnerId = winning.id[Math.floor(winning.id.length * Math.random() - .0000001)];

      return lunch.set('restaurant_id', winnerId).save();
    })
    .then(function(){
      return lunch.load(['lunch_restaurants', 'restaurant'])
    })
    .then(function(){
      return when.map(lunch.related('lunch_restaurants').map(function(lr){
        return lr.load('voters')
      }));

    })
    .then(function(){
      lunch.related('lunch_restaurants').each(function(lr){

        lr.related('voters').each(function(user){
          if (!_.include(emailedIds, user.id)) {
            emailedIds.push(user.id);
            user.mailers.notifyVotingClosed(lunch);
          };
        });
      })

      return RestaurantNotifications.sendForRestaurant(lunch, emailedIds).then(function(){
        res.redirect('/lunches/' + lunch.id + '/orders');
      });

    })
    .otherwise(function(){
      res.redirect('back');
    });    
  },

  foodArrived: function(req, res, next) {

    lunch = Lunch.forge({id: req.params.lunch_id});

    lunch.fetch({withRelated: ['users', 'restaurant']})
    .then(function(){

      // Access
      if (lunch.get('user_id') !== req.session.user_id && !req.locals.user.get('admin')) {
        req.error('You must be the lunch owner to tally the votes');
        return when.reject()
      };

      if (lunch.get('food_arrived')) {
        req.error('The "food has arrived" email has already been sent out');
        return when.reject()
      };

      lunch.related('users').each(function(user){
        user.mailers.notifyFoodHere(lunch);
      })
      return lunch.set('food_arrived', true).save();

    })
    .then(function(){
      res.redirect('/lunches/' + lunch.id + '/orders');
    })
    .otherwise(function(){
      res.redirect('back');
    });    
  },

};

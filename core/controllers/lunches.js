var
  bookshelf = require('../models/base'),
  Restaurants = require('../models/restaurant').Restaurants,
  RestaurantNotification = require('../models/restaurant_notification').RestaurantNotification,
  LunchRestaurant  = require('../models/lunch_restaurant').LunchRestaurant,
  Users = require('../models/user').Users,
  Lunches = require('../models/lunch').Lunches,
  Food = require('../models/food').Food,
  Orders = require('../models/order').Orders,
  Order = require('../models/order').Order,
  Lunch  = require('../models/lunch').Lunch;

module.exports = {

  create: function(req, res, next){
    var attributes = { name: _.escape(req.body.name), user_id: req.body.user_id }

    if (!req.body.restaurant_id || !_.size(req.body.restaurant_id)) {
      req.error('You must pick at least one restaurant');
      return res.redirect('back')
    }

    if (_.size(req.body.restaurant_id) == 1)
      attributes.restaurant_id = _.keys(req.body.restaurant_id)[0].substring(1)

    Lunch.forge(attributes).save()
    .then(function(lunch){
      if (lunch && lunch.id) {
        req.notification('Created new lunch');
        return lunch.setupVoting(req.body.restaurant_id);
      }
    })
    .then(function(){
      res.redirect('/')
    })

  },

  show: function(req, res, next) {

    var lunch;

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['restaurant', 'restaurants']})
    .then(function(_lunch){
      lunch = _lunch;
      return Orders.forge().query({where: {lunch_id: req.params.lunch_id}}).fetch({withRelated: ['foods', 'user']});
    })
    .then(function(orders){
      res.view('lunches/show', {orders: orders, lunch: lunch});
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

    var restaurant_ids = _.map(_.keys(req.body.restaurant_id), function(id){
      return parseInt(id.substring(1));
    });

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['lunch_restaurants']})
    .then(function(lunch){
      if ( lunch.get('user_id') == req.session.user_id || req.session.admin )
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

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['restaurants']})
    .then(function(_lunch){
      lunch = _lunch;

      // Access
      if (lunch.get('user_id') !== req.session.user_id || req.session.admin)
        req.error('You must be the lunch owner to close the order');
      else
        return lunch.set('closed', true).save()
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
      if (lunch.get('user_id') !== req.session.user_id && !req.session.admin) {
        req.error('You must be the lunch owner to tally the votes');
        return when.reject()
      };

      var max = {id: [], votes: -1};
      lunch.related('restaurants').each(function(restaurant){
        if (restaurant.pivot.get('votes') == max.votes) {
          max.id.push(restaurant.id);
        } else if (restaurant.pivot.get('votes') > max.votes) {
          max.id = [restaurant.id];
          max.votes = restaurant.pivot.get('votes');
        };
      });

      // Picks a random id of all the ones that tied for top place
      var id = max.id[Math.floor(max.id.length * Math.random() - .0000001)];

      console.log('ID'.red, id);
      return lunch.set('restaurant_id', id).save();
    })
    .then(function(){
      console.log("HEY!~!!!!".red, lunch.id)
      return lunch.load('lunch_restaurants')
    })
    .then(function(){
      console.log('lrs'.green);
      return when.map(lunch.related('lunch_restaurants').map(function(lr){
        return lr.load('voters')

      }));

    })
    .then(function(){
      lunch.related('lunch_restaurants').each(function(lr){
        console.log('lr'.green, lr.toJSON(), lr, lr.related('voters'));
        lr.related('voters').each(function(user){
          console.log('SER'.green, user);
          if (!_.include(emailedIds, user.id)) {
            emailedIds.push(user.id);
            user.mailers.notifyVotingClosed();
          };
        });
      })
      console.log('RN'.red);

      return RestaurantNotification.forge().fetch({
        where:
          {restaurant_id: lunch.get('restaurant_id')},
        withRelated: ['user'],
      })

    })
    .then(function(rns){
      
      rns.each(function(rn){
        console.log('RN'.green, rn.related('user'));
        var user = rn.related('user');
        if (!_.include(emailedIds, user.id)) {
          emailedIds.push(user.id)
          user.mailers.notifyVotingClosed(lunch)
        }
      });
      res.redirect('/lunches/' + lunch.id + '/orders');
    })
    .otherwise(function(){
      console.log('ERROR'.red, arguments)
      res.redirect('back');
    });    
  },

};

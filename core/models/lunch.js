var
  Lunch, Lunches,
  columns, instanceMethods, classMethods, options,
  RestaurantNotifications = require('../models/restaurant_notification').RestaurantNotifications,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

require('../lib/mysql_date_format');

instanceMethods = {

  tableName: 'lunches',

  initialize: function(){

    this.on('creating', function(){
      this.set('created_at', (new Date).toMysqlFormat());
    }, this);

    bookshelf.Model.prototype.initialize.apply(this, arguments);

  },

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'user_id', 
    'name', 
    'closed', 
    'food_arrived', 
    'restaurant_id', 
    'created_at', 
  ],

  restaurants: function(){
    return this
      .belongsToMany(require('./restaurant').Restaurants, 'lunch_restaurants')
      .withPivot(['votes', 'id']);
  },

  users: function(){
    return this
      .belongsToMany(require('./user').Users, 'orders');
  },

  user: function(){
    return this.belongsTo(require('../models/user').User);
  },

  restaurant: function(){
    return this.belongsTo(require('../models/restaurant').Restaurant);
  },

  orders: function(){
    return this.hasMany(require('../models/order').Orders);
  },

  lunch_restaurants: function(){
    return this.hasMany(require('../models/lunch_restaurant').LunchRestaurants);
  },

  validations: {
    name: function(val){
      check(val || '', 'Lunch name must be between 2 and 45 characters').len(2, 45); 
    },
  },

  setupVoting: function(restaurant_ids){

    var lunch = this;

    return when.map(_.keys(restaurant_ids), function(restaurant_id){
      return require('../models/lunch_restaurant').LunchRestaurant.forge({
        votes: 0,
        restaurant_id: restaurant_id.substring(1),
        lunch_id: lunch.id
      }).save()
    })
    .then(function(){
      return require('./user').Users.forge().query({where: {notify_start_vote: true}}).fetch();
    })
    .then(function(users){
      if (lunch.get('restaurant_id'))
        RestaurantNotifications.sendForRestaurant(lunch);
      else
        users.each(function(user){
          console.log('NO ONE WHAT'.red, user);
          if (user.get('notify_start_vote'))
            user.mailers.notifyVote(lunch);
        });
    });
  },

};

classMethods = {

};

options = {
  instanceMethods: instanceMethods,
  classMethods: classMethods,
};

Lunch = bookshelf.Model.extend(instanceMethods, classMethods);
Lunches = bookshelf.Collection.extend({ model: Lunch });
    
module.exports = {Lunch: Lunch, Lunches: Lunches};

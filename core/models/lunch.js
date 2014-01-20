var
  Lunch, Lunches,
  columns, instanceMethods, classMethods, options,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'lunches',

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'user_id', 
    'name', 
    'closed', 
    'restaurant_id', 
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
      return require('./user').Users.forge().fetch({where: {notify_start_vote: true}});
    })
    .then(function(users){
      if (_.keys(restaurant_ids).length > 1)
        users.each(function(user){
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

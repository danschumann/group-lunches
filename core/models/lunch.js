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
    'restaurant_id', 
  ],

  restaurants: function(){
    return this
      .belongsToMany(require('../models/restaurant').Restaurants, 'lunch_restaurants')
      .withPivot(['votes', 'id']);
  },

  users: function(){
    return this
      .belongsToMany(require('../models/user').Users, 'orders');
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

    console.log('dhe'.blue, restaurant_ids);
    return when.map(_.keys(restaurant_ids), function(restaurant_id){
      console.log('heyo'.red, restaurant_id);
      return require('../models/lunch_restaurant').LunchRestaurant.forge({
        votes: 0,
        restaurant_id: restaurant_id.substring(1),
        lunch_id: lunch.id
      }).save()
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

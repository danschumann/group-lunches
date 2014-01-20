var
  LunchRestaurant, LunchRestaurants,
  columns, instanceMethods, classMethods, options,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'lunch_restaurants',

  lunch: function(){
    return this.belongsTo(require('./lunch').Lunch);
  },

  restaurant: function(){
    return this.belongsTo(require('./restaurant').Restaurant);
  },

  voters: function(){
    return this.belongsToMany(require('./user').User, 'votes');
  },

  votes: function(){
    return this.hasMany(require('./vote').Votes);
  },

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'votes', 
    'lunch_id', 
    'restaurant_id', 
  ],

  validations: {
  },

};

classMethods = {

};

options = {
  instanceMethods: instanceMethods,
  classMethods: classMethods,
};

LunchRestaurant = bookshelf.Model.extend(instanceMethods, classMethods);
LunchRestaurants = bookshelf.Collection.extend({ model: LunchRestaurant });
    
module.exports = {LunchRestaurant: LunchRestaurant, LunchRestaurants: LunchRestaurants};


var
  Restaurant, Restaurants,
  columns, instanceMethods, classMethods, options,

  sanitizeURL = require('../lib/sanitize_url')

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'restaurants',

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'name', 
    'menu_url', 
    'notes', 
  ],

  foods: function(){
    return this.hasMany(require('./food').Foods);
  },

  notifications: function(){
    return this.hasMany(require('./restaurant_notification').RestaurantNotification);
  },

  sanitize: function(){
    this.set('name', _.escape(this.get('name')));
    this.set('menu_url', sanitizeURL(_.escape(this.get('menu_url'))));
    this.set('notes', _.escape(this.get('notes')));
    return this;
  },

  validations: {
    name: function(val){
      check(val || '', 'Restaurant name must be between 2 and 45 characters').len(2, 45); 
    },
    menu_url: function(val){
      check(val || '', 'Restaurant url must be valid url').isUrl(); 
    },
  },

};

classMethods = {

};

options = {
  instanceMethods: instanceMethods,
  classMethods: classMethods,
};

Restaurant = bookshelf.Model.extend(instanceMethods, classMethods);
Restaurants = bookshelf.Collection.extend({ model: Restaurant, tableName: 'restaurants', });
    
module.exports = {Restaurant: Restaurant, Restaurants: Restaurants};

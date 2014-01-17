
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

  sanitize: function(){
    this.set('menu_url', sanitizeURL(this.get('menu_url')));
    return this;
  },

  validations: {
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

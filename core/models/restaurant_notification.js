
var
  RestaurantNotification, RestaurantNotifications,
  columns, instanceMethods, classMethods, options,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'restaurant_notifications',

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'restaurant_id', 
    'user_id', 
  ],

  user: function(){
    return this.belongsTo(require('./user').User);
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

RestaurantNotification = bookshelf.Model.extend(instanceMethods, classMethods);
RestaurantNotifications = bookshelf.Collection.extend({
  model: RestaurantNotification,
  tableName: 'restaurant_notifications',
});
    
module.exports = {RestaurantNotification: RestaurantNotification, RestaurantNotifications: RestaurantNotifications};

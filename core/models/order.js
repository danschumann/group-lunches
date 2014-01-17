
var
  Order, Orders,
  columns, instanceMethods, classMethods, options,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'orders',

  lunch: function(){
    return this.belongsTo(require('./lunch').Lunch);
  },

  user: function(){
    return this.belongsTo(require('./user').User);
  },

  foods: function(){
    return this.hasMany(require('./user').Foods);
  },

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'user_id', 
    'lunch_id', 
    'food', 
    'price', 
    'paid', 
  ],

  validations: {
    food: function(val){
      check(val || '', 'Food must be between 2 and 1024 characters').len(2, 1024); 
    },
  },

};

classMethods = {

};

options = {
  instanceMethods: instanceMethods,
  classMethods: classMethods,
};

Order = bookshelf.Model.extend(instanceMethods, classMethods);
Orders = bookshelf.Collection.extend({ model: Order, tableName: 'orders', });
    
module.exports = {Order: Order, Orders: Orders};

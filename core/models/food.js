var
  Food, Foods,
  columns, instanceMethods, classMethods, options,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'foods',

  order: function(){
    return this.belongsTo(require('./order').Order);
  },

  // Denormalized restaurant makes it easier to reselect foods later
  restaurant: function(){
    return this.belongsTo(require('./restaurant').Restaurant);
  },

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'order_id', 
    'restaurant_id', 
    'name', 
    'notes', 
    'price', 
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

Food = bookshelf.Model.extend(instanceMethods, classMethods);
Foods = bookshelf.Collection.extend({ model: Food, tableName: 'foods', });
    
module.exports = {Food: Food, Foods: Foods};

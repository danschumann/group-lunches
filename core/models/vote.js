
var
  Vote, Votes,
  columns, instanceMethods, classMethods, options,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'votes',

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'lunch_restaurant_id', 
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

Vote = bookshelf.Model.extend(instanceMethods, classMethods);
Votes = bookshelf.Collection.extend({ model: Vote, tableName: 'votes', });
    
module.exports = {Vote: Vote, Votes: Votes};

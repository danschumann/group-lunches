var
  Comment, Comments,
  columns, instanceMethods, classMethods, options,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'comments',

  lunch: function(){
    return this.belongsTo(require('./lunch').Lunch);
  },

  // Denormalized restaurant makes it easier to reselect comments later
  user: function(){
    return this.belongsTo(require('./user').User);
  },

  // Email functions can take up a lot of room
  permittedAttributes: [
    'id',
    'lunch_id', 
    'user_id', 
    'content', 
  ],

  validations: {
    content: function(val){
      check(val || '', 'Comment must be between 2 and 1024 characters').len(2, 1024); 
    },
  },

};

classMethods = {

};

options = {
  instanceMethods: instanceMethods,
  classMethods: classMethods,
};

Comment = bookshelf.Model.extend(instanceMethods, classMethods);
Comments = bookshelf.Collection.extend({ model: Comment, tableName: 'comments', });
    
module.exports = {Comment: Comment, Comments: Comments};

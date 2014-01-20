var
  bookshelf = require('../models/base'),
  Food = require('../models/food').Food,
  Orders = require('../models/order').Orders,
  Order = require('../models/order').Order,
  Lunch  = require('../models/lunch').Lunch;

module.exports = {

  index: function(req, res, next) {

    var lunch;

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['restaurant']})
    .then(function(_lunch){
      lunch = _lunch;
      return Orders.forge().query({where: {lunch_id: req.params.lunch_id}}).fetch({withRelated: ['foods', 'user']});
    })
    .then(function(orders){
      console.log(orders)
      res.view('orders/index', {orders: orders, lunch: lunch});
    });

  },

};

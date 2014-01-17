var
  bookshelf = require('../models/base'),
  Order = require('../models/order').Order,
  Lunch  = require('../models/lunch').Lunch;

module.exports = {

  create: function(req, res, next){

    var attributes = {
      food: _.escape(req.body.food),
      price: parseFloat(req.body.price),
      user_id: req.session.user_id,
      lunch_id: req.params.lunch_id,
    };

    Order.forge(attributes).save()
    .then(function(order){
      if (order && order.id)
        req.notification('Created new order');
      res.redirect('/lunches/' + req.params.lunch_id + '/orders')
    })

  },

  index: function(req, res, next) {

    var users, restaurants;

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['restaurant', 'users']})
    .then(function(lunch){
      res.view('orders/index', {lunch: lunch});
    });

  },

  edit: function(req, res, next){

    var users, restaurants;
    when().then(function(){
      if (req.params.order_id)
        return Order.forge({id: req.params.order_id}).fetch({withRelated: ['lunch']});
    })
    .then(function(order){
      res.view('orders/edit', {lunch_id: parseInt(req.params.lunch_id), order: order});
    });

  },

};

var
  bookshelf = require('../models/base'),
  Orders = require('../models/order').Orders,
  Order = require('../models/order').Order;

module.exports = {

  // API
  update: function(req, res, next){

    var order = Order.forge({id: req.params.order_id});

    order.fetch({withRelated: ['lunch']})
    .then(function(){
      if (order.related('lunch').get('user_id') !== req.session.user_id && !req.locals.user.get('admin'))
        return when.reject();
      else {
        return order.set('paid', parseFloat(req.body.paid).toFixed(2)).save();
      }
    })
    .then(function(){
      res.send(order.get('paid'));
    })
    .otherwise(function(){
      res.send(false);
    });

  },

};

var
  bookshelf = require('../models/base'),
  Food = require('../models/food').Food,
  Orders = require('../models/order').Orders,
  Order = require('../models/order').Order,
  Lunch  = require('../models/lunch').Lunch;

module.exports = {

  create: function(req, res, next){

    var attributes = {
      user_id: req.session.user_id,
      lunch_id: req.params.lunch_id,
    };

    var lunch, order;

    Lunch.forge({id: req.params.lunch_id}).fetch()
    .then(function(_lunch){
      lunch = _lunch;
      order = Order.forge(attributes)
      return order.fetch();
    })
    .then(function(){
      if (!order.id)
        return order.save();
      else
        return order;
    })
    .then(function(){
      return Food.forge({
        restaurant_id: lunch.get('restaurant_id'),
        order_id: order.id,
        name: _.escape(req.body.food),
        price: parseFloat(req.body.price),
      }).save();
    })
    .then(function(){
      return order.load(['foods'])
    })
    .then(function(){
      var price = 0
      order.related('foods').each(function(food){
        price += food.get('price')
      });
      return order.set('price', price).save();
    })
    .then(function(){
      res.redirect('/lunches/' + req.params.lunch_id + '/orders')
    });

  },
  
  update: function(req, res, next){
    Food.forge({id: req.params.food_id}).fetch()
    .then(function(food){
      return food.set({
        name: _.escape(req.body.food),
        price: parseFloat(req.body.price),
      }).save()
    })
    .then(function(){
      res.redirect('/lunches/' + req.params.lunch_id + '/orders');
    });
  },

  edit: function(req, res, next){

    var users, restaurants, lunch;

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: [
      {'restaurant.foods': function(qb){ qb.limit(20).orderBy('id', 'desc'); }},
    ]})
    .then(function(_lunch){
      lunch = _lunch;
      if (req.params.lunch_id)
        return Food.forge({id: req.params.food_id}).fetch();
    })
    .then(function(food){
      console.log('heyo', food);
      res.view('foods/edit', {food: food, lunch: lunch});
    });

  },

};

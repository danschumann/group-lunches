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

    var price = parseFloat(('' + req.body.price).replace(/[^\d\.]/g, ''));
    if (_.isNaN(price)) {
      req.error('That price does not work');
      return module.exports.edit.apply(this, arguments);
    }

    var lunch, order;

    Lunch.forge({id: req.params.lunch_id}).fetch()
    .then(function(_lunch){
      lunch = _lunch;
      if (lunch.get('closed')){
        req.error('The owner of this order has closed it');
        return when.reject();
      }
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
        name: _.escape(req.body.name),
        notes: _.escape(req.body.notes),
        price: price,
      }).save();
    })
    .then(function(){
      return order.load(['foods'])
    })
    .then(function(){
      return order.calculate()
    })
    .then(function(){
      res.redirect('/lunches/' + req.params.lunch_id + '/orders')
    })
    .otherwise(function(){
      res.redirect('back');
    })
    ;

  },
  
  destroy: function(req, res, next){

    var food = Food.forge({id: req.params.food_id});
    food.fetch({withRelated: ['order']})
    .then(function(){
      if ((food.related('order').get('user_id') !== req.session.user_id) && !req.session.admin)
        req.error('You are not authorized to change this food item');
      else {
        req.notification('deleted ' + food.get('name'));
        return food.destroy();
      }
    })
    .then(function(){
      return food.related('order').calculate();
    })
    .then(function(){
      res.redirect('/lunches/' + req.params.lunch_id + '/orders');
    });
  },

  update: function(req, res, next){
    var price = parseFloat(('' + req.body.price).replace(/[^\d\.]/g, ''));
    Food.forge({id: req.params.food_id}).fetch({withRelated: ['order']})
    .then(function(food){
      if (food.related('order').get('user_id') !== req.session.user_id && !req.session.admin)
        req.error('You are not authorized to change this food item');
      else if (_.isNaN(price))
        req.error('That price does not work');
      else
        return food.set({
          name: _.escape(req.body.name),
          notes: _.escape(req.body.notes),
          price: price,
        }).save();
    })
    .then(function(){
      res.redirect('/lunches/' + req.params.lunch_id + '/orders');
    });
  },

  edit: function(req, res, next){

    var users, restaurants, lunch;

    if(req.body.name) req.body.name = _.escape(req.body.name);
    if(req.body.notes) req.body.notes = _.escape(req.body.notes);
    if(req.body.price) req.body.price = parseFloat(req.body.price);

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

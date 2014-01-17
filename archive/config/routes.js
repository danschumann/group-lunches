var base = require('../routes');
var restaurant = require('../routes/restaurants');
var lunch_restaurant = require('../routes/lunch_restaurants');
var lunch = require('../routes/lunch');
var order = require('../routes/order');

module.exports = function(app) {

  app.get('/', base.index);

  app.post('/restaurants', restaurant.create);

  app.post('/lunches', lunch.create);

  app.post('/lunch_restaurants/:lr_id/vote', lunch_restaurant.vote);

  app.get('/lunches/:lunch_id',
    lunch.load_from_params,
    lunch.show);

  app.post('/lunches/:lunch_id',
    lunch.load_from_params,
    lunch.update);

  app.get('/lunches/:lunch_id/orders/new',
    lunch.load_from_params,
    order.new);

  app.get('/lunches/:lunch_id/orders/:order_id',
    lunch.load_from_params,
    order.load_from_params,
    order.show);

  app.get('/lunches/:lunch_id/orders/:order_id/delete',
    lunch.load_from_params,
    order.load_from_params,
    order.destroy);

  app.post('/lunches/:lunch_id/orders',
    lunch.load_from_params,
    order.create);

  app.post('/lunches/:lunch_id/orders/:order_id',
    lunch.load_from_params,
    order.load_from_params,
    order.update);

};

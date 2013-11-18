var base = require('../routes');
var lunch = require('../routes/lunch');
var order = require('../routes/order');

module.exports = function(app) {

  app.get('/', base.index);

  app.post('/lunches', lunch.create);

  app.get('/lunches/:lunch_id',
    lunch.load_from_params,
    lunch.show);

  app.get('/lunches/:lunch_id/orders/new',
    lunch.load_from_params,
    order.new);

  app.get('/lunches/:lunch_id/orders/:order_id',
    lunch.load_from_params,
    order.load_from_params,
    order.show);

  app.post('/lunches/:lunch_id/orders',
    lunch.load_from_params,
    order.create);

  app.post('/lunches/:lunch_id/orders/:order_id',
    lunch.load_from_params,
    order.load_from_params,
    order.update);

};

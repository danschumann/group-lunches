var base = require('../routes');
var lunch = require('../routes/lunch');
var order = require('../routes/order');

module.exports = function(app) {

  app.get('/', base.index);

  app.post('/lunches', lunch.create);
  app.get('/lunches/:id', lunch.show);

  app.get('/lunches/:lunch_id/orders/new', order.new);
  app.get('/lunches/:lunch_id/orders/:order_id', order.show);
  app.post('/lunches/:lunch_id/orders', order.create);
  app.post('/lunches/:lunch_id/orders/:order_id', order.update);

};

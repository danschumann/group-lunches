_ = require('underscore');

exports.create = function(req, res, next) {
  var user, description, lunch_id, order;
  
  user = req.body.user;
  description = req.body.description;
  lunch_id = req.params.lunch_id;

  order = new Order({
    user: user,
    description: description,
    lunch_id: lunch_id
  });

  req.session.order = order.attributes;
  console.log('doh session', req.session);

  order.save();
  res.redirect('/lunches/' + lunch_id);
};

exports.new = function(req, res) {
  console.log('does it noew');
  res.render('orders/edit', {lunch_id: req.params.lunch_id} );
};

exports.show = function(req, res) {
  var order;
  
  order = Order.find(req.params.order_id);

  if (order.lunch_id !== req.params.lunch_id ) order = null;

  console.log('show order', order);
  res.render('orders/edit', {lunch_id: req.params.lunch_id, order: order} );
};

exports.update = function(req, res) {
  var order;
  
  order = Order.find(req.params.order_id);
  _.extend(order, _.pick(req.body, 'user', 'description'));
  (new Order(order)).save()

  console.log('show order', order);
  res.redirect('/lunches/' + req.params.lunch_id);
};

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
  order.save();

  // TODO: Save users and remove this
  req.session.order = order.attributes;

  res.redirect('/lunches/' + lunch_id);
};

exports.new = function(req, res) {
  lunch_id = req.params.lunch_id;
  res.render('orders/edit', {lunch_id: lunch_id});
};

exports.show = function(req, res) {
  var order;
  
  order = Order.find(req.params.order_id);

  if (order.lunch_id !== req.params.lunch_id ) order = null;

  lunch_id = req.params.lunch_id;
  res.render('orders/edit', {lunch_id: lunch_id, order: order} );
};

exports.update = function(req, res) {
  var order;
  
  order = Order.find(req.params.order_id);

  order.user = req.body.user;

  order.description = req.body.description;

  (new Order(order)).save()

  res.redirect('/lunches/' + req.params.lunch_id);
};

_ = require('underscore');

exports.create = function(req, res, next) {

  user = req.body.user;
  description = req.body.description;
  lunch_id = req.body.lunch_id;

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
  res.render('orders/edit', {lunch_id: req.params.lunch_id} );
};

exports.show = function(req, res) {
  order = Order.find(req.params.order_id);
  res.render('orders/edit', {lunch_id: req.params.lunch_id, order: order} );
};

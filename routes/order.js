_ = require('underscore');

exports.post_order = function(req, res, next) {

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
  res.redirect('/grouplunch/' + lunch_id);
};

exports.neworder = function(req, res) {
  res.render('orders/edit', {lunch_id: req.params.lunch_id} );
};

_ = require('underscore');

exports.create = function(req, res, next) {

<<<<<<< HEAD
  user = req.body.user;
  description = req.body.description;
  lunch_id = req.body.lunch_id;
=======
  item_number = req.body.item_number;
  name = req.body.name;
  price = req.body.price;
  lunch_id = req.params.lunch_id;
>>>>>>> c9819647c4841bc9524e91a8f3b2ac6fa6bf1d5e

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

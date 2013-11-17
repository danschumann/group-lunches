_ = require('underscore');

exports.create = function(req, res, next) {

  item_number = req.body.item_number;
  name = req.body.name;
  price = req.body.price;
  lunch_id = req.params.lunch_id;

  order = new Order({
    item_number: item_number,
    name: name,
    price: price,
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

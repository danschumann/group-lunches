_ = require('underscore');

exports.post_order = function(req, res, next) {

  item_number = req.body.item_number;
  name = req.body.name;
  price = req.body.price;
  lunch_id = req.body.lunch_id;

  order = new Order({
    item_number: item_number,
    name: name,
    price: price,
    lunch_id: lunch_id
  });

  req.session.order = order.attributes;
  console.log('doh session', req.session);

  order.save();
  res.redirect('/grouplunch/' + lunch_id);
};

exports.neworder = function(req, res) {
  res.render('neworder', {lunch_id: req.params.lunch_id} );
};

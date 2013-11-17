_ = require('underscore');

exports.post_order = function(req, res, next) {

  item_number = req.body.item_number;
  name = req.body.name;
  price = req.body.price;
  lunch_id = parseInt(req.body.lunch_id);

  order = new Order({
    item_number: item_number,
    name: name,
    price: price,
    lunch_id: price
  });

  console.log('my order item', order)
  req.session.order = order.attributes;
  order.save();
  res.redirect('/lunch/' + lunch_id);
};

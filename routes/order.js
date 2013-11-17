_ = require('underscore');

exports.post_order = function(req, res, next) {

  console.log('posting order', req.body);
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

  console.log('my order item', order);
  req.session.order = order.attributes;
  order.save();
  res.redirect('/grouplunch/' + lunch_id);
};

exports.neworder = function(req, res) {
  res.render('neworder', {lunch_id: req.params.lunch_id} );
  console.log("lunch id", req.params.lunch_id)
};

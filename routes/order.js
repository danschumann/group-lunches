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

  console.log('my order item', order);
  req.session.order = order.attributes;
  order.save();
  res.redirect('/grouplunch/' + lunch_id);
};

exports.neworder = function(req, res) {
<<<<<<< HEAD
  res.render('neworder', {lunch_id: req.params.lunch_id});
=======
  res.render('neworder', {lunch_id: req.params.lunch_id} );
  console.log("lunch id", req.params.lunch_id)
>>>>>>> 7ec3413465c75f2a2274e6000167a4fd4dc11293
};
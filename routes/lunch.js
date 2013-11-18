_ = require('underscore');

exports.create = function(req, res, next) {

  menu_url = ('' + req.body.menu_url).sanitize_url();
  title = req.body.title;

  var lunch = new Lunch({
    title: title,
    menu_url: menu_url
  });
  lunch.save();

  // TODO: Don't remember lunch on session -- create users
  req.session.lunch = lunch.attributes;

  res.redirect('/lunches/' + lunch.attributes.id);
};

exports.show = function(req, res) {

  var lunch = Lunch.find(req.params.id);

  orders = lunch.findOrders();

  lunch.orders = orders;

  if ( req.session.order && req.params.id == req.session.order.lunch_id )
    lunch.existing = req.session.order;

  res.render('lunches/show', lunch);
};

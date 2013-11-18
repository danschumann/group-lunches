_ = require('underscore');

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
pattern = /^http(s)?:\/\//i;

var sanitize_url = function(teststring){
  teststring = teststring.trim();
  if(teststring.search(pattern) == -1){
    teststring = 'http://' + teststring;
  }
  return teststring;
}

exports.create = function(req, res, next) {
  lunch = null
  lunch = new Lunch({title: req.body.title, menu_url: sanitize_url(req.body.menu_url)});
  console.log('my lunch', lunch)
  req.session.lunch = lunch.attributes;
  lunch.save();
  res.redirect('/lunches/' + lunch.attributes.id);
};

exports.new = function(req, res) {
  res.render('lunches/edit', req.session.lunch);
};

exports.show = function(req, res) {
  lunch = null
  lunch = Lunch.find(req.params.id);
  orders = lunch.findOrders();

  lunch.orders = orders;

  if ( req.params.id == req.session.order.lunch_id )
    lunch.existing = req.session.order;

  console.log('sess', req.session)
  res.render('lunches/show', lunch);
};

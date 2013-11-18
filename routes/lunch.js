_ = require('underscore');

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
pattern = /^http(s)?:\/\//i;

var sanitize_url = function(teststring){
  if (!teststring) 
    return;
  teststring = teststring.trim();
  if(teststring.search(pattern) == -1){
    teststring = 'http://' + teststring;
  }
  return teststring;
}

exports.create = function(req, res, next) {
  var lunch = new Lunch({title: req.body.title, menu_url: sanitize_url(req.body.menu_url)});
  req.session.lunch = lunch.attributes;
  lunch.save();
  res.redirect('/lunches/' + lunch.attributes.id);
};

exports.new = function(req, res) {
  res.render('lunches/edit', req.session.lunch);
};

exports.show = function(req, res) {
  var lunch = Lunch.find(req.params.id);
  orders = lunch.findOrders();

  lunch.orders = orders;

  if ( req.params.id == req.session.order.lunch_id )
    lunch.existing = req.session.order;

  res.render('lunches/show', lunch);
};

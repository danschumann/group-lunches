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

exports.post_lunch = function(req, res, next) {
  lunch = new Lunch({title: req.body.title, menu_url: sanitize_url(req.body.menu_url)});
  console.log('my lunch', lunch)
  req.session.lunch = lunch.attributes;
  lunch.save();
  res.redirect('/newlunch');
};

exports.newlunch = function(req, res) {
  res.render('lunches/edit', req.session.lunch);
};

exports.grouplunch = function(req, res) {
  grouplunch = Lunch.find(req.params.id);
  orders = grouplunch.findOrders();

  grouplunch.orders = orders;

  if ( req.params.id == req.session.order.lunch_id )
    grouplunch.existing = req.session.order;

  console.log('sess', req.session)
  res.render('lunches/show', grouplunch);
};

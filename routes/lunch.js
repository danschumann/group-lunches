_ = require('underscore');

exports.post_lunch = function(req, res, next) {
  lunch = new Lunch({title: req.body.title, menu_url: req.body.menu_url});
  console.log('my lunch', lunch)
  req.session.lunch = lunch.attributes;
  lunch.save();
  res.redirect('/newlunch');
};

exports.newlunch = function(req, res) {
  res.render('newlunch', req.session.lunch);
};

exports.grouplunch = function(req, res) {
	grouplunch = Lunch.find(parseInt(req.params.id));  
	res.render('grouplunch', grouplunch);
};

exports.addorder = function(req, res) {
  res.render('addorder', req.session.lunch);
};

exports.post_addorder = function(req, res) {
  console.log('add order', req.body.myorder);
  res.redirect('/newlunch');
  res.render('addorder', req.session.lunch);
};
_ = require('underscore');

exports.post_lunch = function(req, res, next) {
  lunch = new Lunch({title: req.body.title});
  console.log('my lunch', lunch)
  req.session.lunch = lunch.attributes;
  lunch.save();
  res.redirect('/newlunch');
};

exports.newlunch = function(req, res) {
  res.render('newlunch', req.session.lunch);
};

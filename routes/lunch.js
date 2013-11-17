_ = require('underscore');

exports.post_lunch = function(req, res, next) {
  lunch = new Lunch({title: req.body.title});
  req.session.lunch = lunch;
  lunch.save();
  res.redirect('/newlunch');
};

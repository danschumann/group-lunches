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

  orders = [
    {price: '1234', name: 'hi there'},
    {price: '1234', name: 'hi there212321'}
  ]
  grouplunch = Lunch.find(parseInt(req.params.id));

  grouplunch.orders = orders;
  res.render('grouplunch', grouplunch);
  console.log('grouplunch',grouplunch);
};

module.exports = function(req, res, next) {
  delete req.session.user_id;
  req.notification('You have been successfully logged out');
  res.redirect('/');
};

exports.vote = function(req, res) {
  var lr = LunchRestaurant.find(req.params.lr_id);
  lr.attributes.votes++;
  lr.save();
  res.redirect('back');

}

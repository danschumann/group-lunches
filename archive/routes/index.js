exports.index = function(req, res){
  res.render('index', {restaurants: Restaurant.collection, lunches: Lunch.collection});
};

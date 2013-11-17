
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.newlunch = function(req, res) {
  res.render('newlunch', { title: "title", id: "newlunch" });
};
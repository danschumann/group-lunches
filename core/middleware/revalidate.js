// All pages should do this since they all have some sort of specific data
module.exports = function(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  //res.header "p3p", 'CP="my compact p3p policy"'
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  next();
};

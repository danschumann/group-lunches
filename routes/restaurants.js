_.extend(exports, {

  create: function(req, res, next) {

    restaurant = new Restaurant(_.pick(req.body, 'name', 'url', 'notes'));
    restaurant.save(); // save() does sanitize url
    res.redirect('back');

  }

});

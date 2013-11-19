_.extend(exports, {

  create: function(req, res, next) {

    var lunch = new Lunch(_.pick(req.body, 'title', 'menu_url'));
    lunch.save(); // save() does sanitize url

    // TODO: Don't remember lunch on session -- create users
    req.session.lunch = lunch.attributes;

    res.redirect('/lunches/' + lunch.attributes.id);
  },

  // This gets put on lots of routes to load a lunch from params
  load_from_params: function(req,res,next){

    // Settings stuff to req.something is not persistant across requests
    req.lunch = Lunch.find(req.params.lunch_id);
    console.log('Loaded Lunch to req.lunch'.green, req.lunch);

    if( !req.lunch )
      res.render('error', {message: 'Could not find that lunch'});
    else
      next() // onto the real part
  },

  show: function(req, res) {

    req.lunch.orders = req.lunch.findOrders();

    // To copy from any domain
    req.lunch.full_url = req.protocol + "://" + req.get('host') + req.url;

    console.log(req.lunch.full_url);

    if ( req.session.lunch && req.session.lunch.id == req.lunch.attributes.id )
      req.lunch.owner = true;

    // TODO: Move order from session and make users
    if ( req.session.order && req.lunch.attributes.id == req.session.order.lunch_id )
      req.lunch.existing = req.session.order;

    res.render('lunches/show', req.lunch);
  }
});

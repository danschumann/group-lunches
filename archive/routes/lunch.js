_.extend(exports, {

  create: function(req, res, next) {
    var restaurant_id;

    // gotta have at least 1 restaurant
    if(!req.body.restaurant_id || !_.size(req.body.restaurant_id)) return res.redirect('back');

    // submitting one means no vote
    if(_.size(req.body.restaurant_id) == 1) restaurant_id = _.keys(req.body.restaurant_id)[0]

    var lunch = new Lunch({name: req.body.name, restaurant_id: restaurant_id});
    lunch.save();

    _.each(req.body.restaurant_id, function(val, restaurant_id){
      lr = new LunchRestaurant({
        votes: 0,
        restaurant_id: restaurant_id,
        lunch_id: lunch.id
      })
      lr.save()
    });

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

  update: function(req, res) {
    _.extend(req.lunch.attributes,
        _.pick(req.body, 'restaurant_id', 'locked')
    );

    req.lunch.save()

    res.redirect('/lunches/' + req.lunch.id);
  },


  show: function(req, res) {

    if (! req.lunch.attributes.restaurant_id ) res.redirect('/');

    req.lunch.orders = req.lunch.findOrders();
    req.lunch.restaurant = req.lunch.getRestaurant();

    // To copy from any domain
    req.lunch.full_url = req.protocol + "://" + req.get('host') + req.url;

    console.log(req.lunch);

    if ( req.session.lunch && req.session.lunch.id == req.lunch.attributes.id )
      req.lunch.owner = true;

    // TODO: Move order from session and make users
    if ( req.session.order && req.lunch.attributes.id == req.session.order.lunch_id )
      req.lunch.existing = req.session.order;

    res.render('lunches/show', req.lunch);
  }
});

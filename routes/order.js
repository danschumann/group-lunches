_ = require('underscore');

_.extend(exports, {

  new: function(req, res) {
    res.render('orders/edit', {lunch: req.lunch.attributes});
  },

  create: function(req, res, next) {
    var user, description, lunch_id, order;
    
    user = req.body.user;
    description = req.body.description;
    lunch_id = req.params.lunch_id;

    order = new Order({
      user: user,
      description: description,
      lunch_id: lunch_id
    });
    order.save();

    // TODO: Save users and remove this
    req.session.order = order.attributes;

    res.redirect('/lunches/' + lunch_id);
  },

  load_from_params: function(req, res, next) {

    // Settings stuff to req.something is not persistant across requests
    req.order = Order.find(req.params.order_id);
    console.log('Loaded Order to req.order'.green, req.order);

    if(!req.order || req.order.attributes.lunch_id !== req.lunch.attributes.id)
      res.render('error', {message: 'Could not find that order'});
    else
      next() // onto the real part
  },

  show: function(req, res) {
    res.render('orders/edit', {lunch: req.lunch.attributes, order: req.order.attributes});
  },

  update: function(req, res) {
    _.extend(req.order.attributes,
        _.pick(req.body, 'user', 'description')
    );

    req.order.save()

    res.redirect('/lunches/' + req.lunch.attributes.id);
  },

  destroy: function(req, res) {

    req.order.destroy()
    res.redirect('/lunches/' + req.lunch.attributes.id);
  }
});

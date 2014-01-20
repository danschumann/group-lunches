var
  bookshelf = require('../models/base'),
  Restaurants = require('../models/restaurant').Restaurants,
  LunchRestaurant  = require('../models/lunch_restaurant').LunchRestaurant,
  Users = require('../models/user').Users,
  Lunches = require('../models/lunch').Lunches,
  Lunch  = require('../models/lunch').Lunch;

module.exports = {

  create: function(req, res, next){
    var attributes = { name: _.escape(req.body.name), user_id: req.body.user_id }

    if (!req.body.restaurant_id || !_.size(req.body.restaurant_id)) {
      req.error('You must pick at least one restaurant');
      return res.redirect('back')
    }

    console.log(_.size(req.body.restaurant_id), _.keys(req.body.restaurant_id)[0])
    if (_.size(req.body.restaurant_id) == 1)
      attributes.restaurant_id = _.keys(req.body.restaurant_id)[0].substring(1)

    Lunch.forge(attributes).save()
    .then(function(lunch){
      return lunch.setupVoting(req.body.restaurant_id);
    })
    .then(function(){
      req.notification('Created new lunch');
      res.redirect('/')
    })

  },

  edit: function(req, res, next) {

    var users, restaurants;

    Users.forge().fetch()
    .then(function(_users){
      users = _users;
      return Restaurants.forge().fetch();
    })
    .then(function(_restaurants){
      restaurants = _restaurants;
      if (req.params.lunch_id)
        return Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['lunch_restaurants']})
    })
    .then(function(lunch){
      res.view('lunches/edit', {lunch: lunch, restaurants: restaurants, users: users});
    });

  },

  update: function(req, res, next) {
    var attributes = _.pick(req.body, 'name', 'user_id');

    _.each(attributes, function(val, key){
      attributes[key] = _.escape(val);
    });

    var restaurant_ids = _.map(_.keys(req.body.restaurant_id), function(id){
      console.log('sam'.blue);
      console.log(arguments);
      return parseInt(id.substring(1));
    });

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['lunch_restaurants']})
    .then(function(lunch){
      if ( lunch.get('user_id') == req.session.user_id )
        return lunch.set(attributes).save()
      else {
        req.error('You must be the owner of this to edit it');
        return when.reject();
      }
    })
    .then(function(lunch){
      lunch.related('lunch_restaurants').map(function(lr){
        if (!_.include(restaurant_ids, lr.get('restaurant_id')))
          lr.destroy()
        return lunch;
      })
      return lunch;
    })
    .then(function(lunch){
      _.each(restaurant_ids, function(id){
        if ( !lunch.related('lunch_restaurants').findWhere({restaurant_id: id}) )
          return LunchRestaurant.forge({
            votes: 0,
            restaurant_id: id,
            lunch_id: lunch.id
          }).save()
      });
      req.notification('Saved ' + attributes.name);
      res.redirect('/')
    })
    .otherwise(function(){
      res.redirect('back');
    });

  },

  tally: function(req, res, next) {

    Lunch.forge({id: req.params.lunch_id}).fetch({withRelated: ['restaurants']})
    .then(function(lunch){
      if (lunch.get('user_id') !== req.session.user_id) {
        req.error('You must be the lunch owner to tally the votes');
        return when.reject()
      };
      var max = {id: [], votes: -1};
      lunch.related('restaurants').each(function(restaurant){
        if (restaurant.pivot.get('votes') == max.votes) {
          max.id.push(restaurant.id);
        } else if (restaurant.pivot.get('votes') > max.votes) {
          max.id = [restaurant.id];
          max.votes = restaurant.pivot.get('votes');
        };
      });

      // Picks a random id of all the ones that tied for top place
      var id = max.id[Math.floor(max.id.length * Math.random() - .0000001)];

      return lunch.set('restaurant_id', id).save();

      console.log(lunch.related('restaurants'))
    })
    .then(function(lunch){
      res.redirect('/lunches/' + lunch.id + '/orders');
    })
    .otherwise(function(){
      res.redirect('back');
    });    
  },

};

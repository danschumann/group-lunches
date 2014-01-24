var
  router,
  loaddir         = require('loaddir'),
  join            = require('path').join,
  when            = require('when'),
  pm              = require('print-messages'),
  _               = require('underscore'),

  // Middleware
  user            = require('../middleware/user'),
  reset_password  = require('../middleware/reset_password'),
  authentication  = require('../middleware/authentication'),

  // Controllers
  controllers  = loaddir({
    path: join(__dirname, '..', 'controllers'),
    require: true,
  });

module.exports = function(app){

  app.get  ('/*', user.load);
  app.get  ('/', controllers.base.index);

  app.get  ('/signup', authentication.non, controllers.signup.index);
  app.post ('/signup', authentication.non, controllers.signup.post);

  app.get  ('/login',  authentication.non, controllers.login.index);
  app.post ('/login',  authentication.non, controllers.login.post);
  app.get  ('/logout', authentication.user, controllers.logout);

  app.get  ('/forgot_password', authentication.non, controllers.forgot_password.index);
  app.post ('/forgot_password', authentication.non, controllers.forgot_password.post);

  app.get  ('/reset_password', authentication.non, reset_password.token, controllers.reset_password.index);
  app.post ('/reset_password', authentication.non, reset_password.token, controllers.reset_password.post);

  //
  // Logged in routes
  //
  app.get  ('/account', authentication.user, user.load, controllers.account.index);
  app.post ('/account', authentication.user, user.load, controllers.account.post);

  app.get  ('/password', authentication.user, user.load, controllers.password.index);
  app.post ('/password', authentication.user, user.load, controllers.password.post);
  
  app.get  ('/email', authentication.user, user.load, controllers.email.index);
  app.post ('/email', authentication.user, user.load, controllers.email.post);

  app.get  ('/restaurants', authentication.user, user.load, controllers.restaurants.index);
  app.post ('/restaurants', user.load, authentication.admin, controllers.restaurants.create);

  app.get  ('/restaurants/new', authentication.user, user.load, controllers.restaurants.edit);
  app.get  ('/restaurants/:restaurant_id', authentication.user, user.load, controllers.restaurants.edit);
  app.post ('/restaurants/:restaurant_id', user.load, authentication.admin, controllers.restaurants.update);

  app.post ('/lunches', authentication.user, user.load, controllers.lunches.create);

  app.get  ('/lunches/new', authentication.user, user.load, controllers.lunches.edit);
  app.get  ('/lunches/:lunch_id', authentication.user, user.load, controllers.lunches.edit);
  app.post ('/lunches/:lunch_id', authentication.user, user.load, controllers.lunches.update);

  app.get  ('/lunches/:lunch_id/tally', authentication.user, user.load, controllers.lunches.tally);
  app.get  ('/lunches/:lunch_id/close', authentication.user, user.load, controllers.lunches.close);
  app.get  ('/lunches/:lunch_id/food_arrived', authentication.user, user.load, controllers.lunches.foodArrived);

  app.get  ('/lunches/:lunch_id/orders', authentication.user, user.load, controllers.lunches.show);

  app.get  ('/lunches/:lunch_id/foods/new', authentication.user, user.load, controllers.foods.edit);
  app.get  ('/lunches/:lunch_id/foods/:food_id', authentication.user, user.load, controllers.foods.edit);
  app.post ('/lunches/:lunch_id/foods/:food_id', authentication.user, user.load, controllers.foods.update);
  app.get  ('/lunches/:lunch_id/foods/:food_id/destroy', authentication.user, user.load, controllers.foods.destroy);
  app.post ('/lunches/:lunch_id/foods/?', authentication.user, user.load, controllers.foods.create);


  app.get  ('/votes/?', authentication.user, user.load, controllers.votes.index);
  app.post ('/votes/?', authentication.user, user.load, controllers.votes.create);

};

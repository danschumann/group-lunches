var
  when = require('when'),
  User = require('../../models/user').User;

module.exports = {

  title: 'Seed admin',

  up: function(data){

    return User.forge({
      first_name: 'admin',
      last_name: 'admin',
      username: 'admin@admin.com',
      password: 'password',
      admin: true,
    })
    .hashPassword().then(function(user){
      console.log(user.toJSON());
      return user.save()
    }).then(function(){
      console.log('created admin user'.green);
    });

  },

  down: function(data){
    //noop
    return when.resolve();
  }
};

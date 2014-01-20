var
  User, Users,
  columns, instanceMethods, classMethods, options,

  config     = require('../lib/config-loader'),
  bookshelf  = require('./base'),
  _          = require('underscore'),
  pm         = require('print-messages'),
  when       = require('when'),
  crypto     = require('crypto'),
  bcrypt     = require('bcrypt'),
  userMailers = require('../mailers/user'),

  check      = bookshelf.check,
  nodefn     = require('when/node/function');

instanceMethods = {

  tableName: 'users',

  // Email functions can take up a lot of room
  mailers: userMailers,

  permittedAttributes: [
    'id',
    'first_name', 
    'last_name', 
    'email', 
    'username', 
    'password', 
    'password_token', 
    'password_token_expires', 
    'admin',
    'notify_start_vote',
    'notify_end_vote',
    'notify_pickup',
  ],

  validations: {
    first_name: function(val){
      check(val || '', 'First name must be between 2 and 45 characters').len(2, 45); 
    },
    last_name: function(val){
      check(val || '', 'Last name must be between 2 and 45 characters').len(2, 45);
    },
    email: function(val){
      check(val || '', 'Must be a valid email').isEmail();
    },
    username: function(val){
      check(val || '', 'Username must be between 3 and 45 characters').len(3, 45);
    },
    password: function(val){
      check(val || '', 'Password must be between 6 and 255 characters').len(6, 255);
    },
    confirm_email: function(val){
      if ( val !== this.get('email') )
        throw new Error('Emails must match');
    },
    confirm_username: function(val){
      if ( val !== this.get('username') )
        throw new Error('Usernames must match');
    },
    confirm_password: function(val){
      if ( val !== this.get('password') )
        throw new Error('Passwords must match');
    },
  },

  formattedEmail: function(){
    return this.get('first_name') + ' ' + this.get('last_name') + ' <' + this.get('email') + '>';
  },

  checkPassword: function(test_pass) {
    return nodefn.call(bcrypt.compare, test_pass, this.get('password'));
  },

  // Makes a salt and hashes the password, then sets it back to user
  hashPassword: function() {

    var user = this;

    return nodefn.call(bcrypt.genSalt, 10)
      .then(function(salt){
        return nodefn.call(bcrypt.hash, user.get('password'), salt);
      })
      .then(function(password){
        user.set('password', password);
        return user
      })
  },

  mustLoad: function(){
    var user = this;

    return this.fetch()
      .then(function(){
        if (!user || !user.id) return when.reject({base: "Could not find that username"});;
      });
  },

  changeEmail: function(attributes){
    var user = this;

    user.set(attributes)
      .check('email')
      .check('confirm_email');

    if ( user.hasError() ) return when.reject(user.errors);

    return user.save();

  },

  editAccount: function(attributes){
    var user = this;

    return user.set(attributes)
      .check('first_name')
      .check('last_name')
      .save();

  },

  changePassword: function(attributes){
    var user = this;

    user.set(attributes)
      .check('password')
      .check('confirm_password');

    if ( user.hasError() ) return when.reject(user.errors);

    return user.hashPassword()
      .then(function(){
        return user.save();
      });

  },

  loginStrategy: function(username, password) {
    var user = this;
    if (config.ldap.enabled) {
      console.log('heyo');

      return nodefn.call(bookshelf.ldapAuthenticate, username, password)
      .otherwise(function(err){
        return user.newError('base', 'Those credentials were not right').reject();
      })
      .then(function(authResult){
        console.log('hey'.red, authResult);
        return user.fetch()
      })
      .then(function(){
        console.log('now we have found user???'.green, user, user.id);
        if ( !user.id )
          return user.save();
        else
          return user;
      })
      .otherwise(function(err){
        if(user.hasError()) return user.reject(); // Already errored out

        return user.newError('base', 'Could not get local user').reject();
      });
    } else
      return this.mustLoad()
      .then(function(){
        return user.checkPassword(attributes.password);
      })


  },

  fullName: function(){
    return this.get('first_name') + ' ' + this.get('last_name');
  },


};

classMethods = {

  signup: function(attributes) {

    var user = User.forge(attributes)
      .check('first_name')
      .check('last_name')
      .check('username')
      .check('confirm_username')
      .check('password');

    return User
      .usernameExists(attributes.username)
      .then(function(exists){
        if (exists)
          user.newError('username', 'That username already exists');

        if ( user.hasError() ) return user.reject();
      })
      .then(function(){
        return user.hashPassword()
      })
      .then(function(){

        return user.save({method: 'insert'})
      })
      .then(function(){
        //user.mailers.signup();
        return user;
      });
  },

  // Takes raw data
  login: function(attributes) {
    var user;

    user = new User({username: attributes.username}).check('username');

    if (!attributes.password)
      user.newError('password', 'You must specify a password')

    if ( user.hasError() ) return when.reject(user.errors);

    return user.loginStrategy(attributes.username, attributes.password)
      .then(function(match){
        console.log('match?'.green);
        if (match)
          return when.resolve(user);
        else
          return when.reject({password: 'That password did not match'});
      });

  },

  forgot_password: function(attributes) {
    var user; 

    // Make sure we have a username
    user = new User({username: attributes.username}).check('username');
    console.log(user.get('username'), user.errors);
    if ( user.hasError() ) return when.reject(user.errors);

    // Make sure username exists
    return user.mustLoad()

      // Save a random token and expire it in an hour
      .then(function(){
        return nodefn.call(crypto.randomBytes, 256);
      })
      .then(function(randomBuffer){
        return user.save({
          password_token:         randomBuffer.toString('hex').substring(0, 255),
          password_token_expires: (new Date).getTime() + 60 * 60 * 1000,
        });
      })

      // Email them the token
      .then(function(){
        user.mailers.forgot_password();
      });

  },

  usernameExists: function(username) {

    return this.forge({username: username}).fetch()
      .then(function(user){
        return user !== null;
      });

  },

  emailExists: function(email) {

    return this.forge({email: email}).fetch()
      .then(function(user){
        return user !== null;
      });

  },

};

options = {
  instanceMethods: instanceMethods,
  classMethods: classMethods,
};

User = bookshelf.Model.extend(instanceMethods, classMethods);
Users = bookshelf.Collection.extend({ model: User });
    
module.exports = {User: User, Users: Users};

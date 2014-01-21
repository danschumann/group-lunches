var
  bookshelf,
  _         = require('underscore'),
  config    = require('../lib/config-loader'),
  Validator = require('validator').Validator,
  Bookshelf = require('bookshelf'),
  when      = require('when'),
  join      = require('path').join;

// Bookshelf Init -- Used primarily for migrations
bookshelf = Bookshelf.lrbc = Bookshelf.initialize(config.data);
bookshelf.validator = new Validator();
bookshelf.check = _.bind(bookshelf.validator.check, bookshelf.validator);
bookshelf.schema = bookshelf.knex.schema;

if (config.ldap && config.ldap.enabled){
  LdapAuth  = require('ldapauth-fork'),
  bookshelf.ldapAuthenticate = function(user, pass, cb){
    bookshelf.ldap = new LdapAuth({
      url: 'ldap://' + config.ldap.host + ':' + config.ldap.port,
      adminDn: config.ldap.admin_user,
      adminPassword: config.ldap.admin_password,
      searchBase: config.ldap.base,
      searchFilter: 'mail={{username}}@*',
    });
    bookshelf.ldap.authenticate(user, pass, function(){
      console.log(arguments);
      bookshelf.ldap.close(function(){})
      cb.apply(this, arguments);
    });
  }
}

bookshelf.Model = bookshelf.Model.extend({

  initialize: function () {

    if (_.isObject(this.mailers)) this.bindMailers();

    this.on('saving', this.sanitizeAttributes, this);
  },

  bindMailers: function(){
    // We have instance.mailers.send_some_username(), that should have context instance
    
    // Don't overwrite prototype
    var mailers = this.mailers;
    this.mailers = {};

    var instance = this;
    _.each(mailers, function(method, name){
      instance.mailers[name] = _.bind(method, instance);
    });
  },

  sanitizeAttributes: function () {
     // Remove any properties which don't belong on the post model
    this.attributes = this.pick(this.permittedAttributes);
  },

  validate: function(){
    var instance = this;
    _.each(_.keys(instance.validations), _.bind(instance.check, instance))

    return this;
  },

  check: function(key) {
    // Runs a validation and adds errors to an instance errors method
    this.errors = this.errors || {};
    try {
      this.validations[key].call(this, this.get(key));
    } catch (er) {
      this.newError(key, er);
    };

    return this;
  },

  newError: function(key, er) {
    if ( _.isString(er) ) er = new Error(er);
    this.errors = this.errors || {};
    this.errors[key] = this.errors[key] || [];
    this.errors[key].push(er);
    return this;
  },

  hasError: function() {
    return _.size(this.errors) > 0;
  },

  reject: function(options) {
    return when.reject(options || this.errors);
  },

});

module.exports = bookshelf;

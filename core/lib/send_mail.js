var
  mailer,
  _           = require('underscore'),
  nodemailer  = require('nodemailer'),
  config      = require('./config-loader');

mailer = nodemailer.createTransport('SMTP', config.mail);

module.exports = _.bind(mailer.sendMail, mailer);

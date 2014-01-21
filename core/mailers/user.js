var
  config = require('../lib/config-loader'),
  nodefn = require('when/node/function'),
  sendMail = require('../lib/send_mail');

module.exports = {

  signup: function(){
    // todo
  },

  notifyClosed: function(lunch){

    var user = this;
    var url = 'http://' + config.hostName + '/lunches/' + lunch.id + '/orders';
    console.log('hi'.blue);
    console.log(lunch.related('restaurant').get('name'));

    nodefn.call(sendMail, {
      to: this.formattedEmail(),
      from: config.mail.from,
      subject: lunch.related('restaurant').get('name') + ' is being called',
      text: 'You can no longer change your order for ' + lunch.get('name') + ' at ' + url + '\n It\'s being called in / picked up',
      html: 'You can no longer change your order for <a href="' + url + '">' + lunch.get('name') + '</a>.  It\'s being called in / picked up ',
    })
    .then(function(){
      console.log('Sent Mail'.green);
    })
    .otherwise(function(){
      console.log('Failed Mail'.red, arguments, user.formattedEmail());
    });
  },

  notifyFoodHere: function(lunch){

    var user = this;
    var url = 'http://' + config.hostName + '/lunches/' + lunch.id + '/orders';

    nodefn.call(sendMail, {
      to: this.formattedEmail(),
      from: config.mail.from,
      subject: lunch.related('restaurant').get('name') + ' is here',
      text: 'Food is here',
      html: 'Food is here',
    })
    .then(function(){
      console.log('Sent Mail'.green);
    })
    .otherwise(function(){
      console.log('Failed Mail'.red, arguments, user.formattedEmail());
    });
  },

  notifyVotingClosed: function(lunch){

    var user = this;
    var url = 'http://' + config.hostName + '/lunches/' + lunch.id + '/orders';
    console.log('hi'.blue);
    console.log(lunch.related('restaurant').get('name'));

    nodefn.call(sendMail, {
      to: this.formattedEmail(),
      from: config.mail.from,
      subject: lunch.related('restaurant').get('name') + ' has won',
      text: 'Voting is closed on : ' + lunch.get('name') + ' at ' + url + '\n You either voted or this restaurant is in your notifications',
      html: 'Voting is closed for <a href="' + url + '">' + lunch.get('name') + '</a><br />You either voted or this restaurant is in your notifications',
    })
    .then(function(){
      console.log('Sent Mail'.green);
    })
    .otherwise(function(){
      console.log('Failed Mail'.red, arguments, user.formattedEmail());
    });
  },
  notifyVote: function(lunch){

    var user = this;
    var url = 'http://' + config.hostName + '/lunches/' + lunch.id + '/orders';

    nodefn.call(sendMail, {
      to: this.formattedEmail(),
      from: config.mail.from,
      subject: 'New Lunch',
      text: 'A new lunch titled: ' + lunch.get('name') + ' has been started at ' + url,
      html: 'Vote for the lunch <a href="' + url + '">' + lunch.get('name') + '</a>',
    })
    .then(function(){
      console.log('Sent Mail'.green);
    })
    .otherwise(function(){
      console.log('Failed Mail'.red, arguments, user.formattedEmail());
    });
  },
  forgot_password: function(){

    var url = 'http://' + config.hostName + '/reset_password?user_id=' + this.id + '&token=' + this.get('password_token')

    nodefn.call(sendMail, {
      to: this.formattedEmail(),
      from: config.mail.from,
      subject: 'Password Recovery',
      text: 'Please recover your password by copying and pasting the following URL into your web browser: \n \n ' + url,
      html: 'Please <a href="' + url + '">click here</a> to reset your password',
    })
    .then(function(){
      console.log('Sent Mail'.green);
    })
    .otherwise(function(){
      console.log('Failed Mail'.red, arguments);
    });
  },
  
};

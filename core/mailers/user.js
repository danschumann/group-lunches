var
  config = require('../lib/config-loader'),
  nodefn = require('when/node/function'),
  sendMail = require('../lib/send_mail');

module.exports = {

  signup: function(){
    // todo
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

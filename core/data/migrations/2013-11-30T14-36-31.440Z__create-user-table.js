module.exports = {

  title: 'Create user table',

  up: function(data){

    return data.schema.createTable('users', function(table){
      table.increments('id').primary();
      table.string('username').unique();
      table.string('email').unique();
      table.string('first_name');
      table.string('last_name');
      table.string('password');
      table.string('password_token');
      table.bigInteger('password_token_expires');
      table.boolean('admin');

      table.boolean('notify_start_vote');
      table.boolean('notify_end_vote');
      table.boolean('notify_pickup');
    }).then(function(){
      console.log('created users'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('users')
      .then(function(){
        console.log('dropped users'.red);
      })
    ;

  }
};

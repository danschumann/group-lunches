module.exports = {

  title: 'Create restaurant notifications table',

  up: function(data){

    return data.schema.createTable('restaurant_notifications', function(table){
      table.increments('id').primary();
      table.integer('restaurant_id');
      table.integer('user_id');
    }).then(function(){
      console.log('created restaurant notifications'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('restaurant_notifications')
      .then(function(){
        console.log('dropped restaurant_notifications'.red);
      })
    ;

  }
};

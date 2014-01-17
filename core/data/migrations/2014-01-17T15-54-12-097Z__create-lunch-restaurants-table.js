module.exports = {

  title: 'Create lunch restaurantss table',

  up: function(data){

    return data.schema.createTable('lunch_restaurants', function(table){
      table.increments('id').primary();
      table.integer('votes');
      table.integer('lunch_id');
      table.integer('restaurant_id');
      table.timestamps();
    }).then(function(){
      console.log('created lunch restaurants'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('lunch_restaurants')
      .then(function(){
        console.log('dropped lunch restaurants'.red);
      })
    ;

  }
};

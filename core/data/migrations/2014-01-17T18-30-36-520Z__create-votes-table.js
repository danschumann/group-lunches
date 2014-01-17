module.exports = {

  title: 'Create votes table',

  up: function(data){

    return data.schema.createTable('votes', function(table){
      table.increments('id').primary();
      table.integer('user_id');
      table.integer('lunch_restaurant_id');
      table.timestamps();
    }).then(function(){
      console.log('created votes'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('votes')
      .then(function(){
        console.log('dropped votes'.red);
      })
    ;

  }
};

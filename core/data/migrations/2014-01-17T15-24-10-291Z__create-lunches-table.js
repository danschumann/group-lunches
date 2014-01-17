module.exports = {

  title: 'Create lunches table',

  up: function(data){

    return data.schema.createTable('lunches', function(table){
      table.increments('id').primary();
      table.integer('user_id');
      table.string('name');
      table.integer('restaurant_id');
      table.timestamps();
    }).then(function(){
      console.log('created lunches'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('lunches')
      .then(function(){
        console.log('dropped lunches'.red);
      })
    ;

  }
};

module.exports = {

  title: 'Create foods table',

  up: function(data){

    return data.schema.createTable('foods', function(table){
      table.increments('id').primary();
      table.integer('order_id');
      table.text('name');
      table.decimal('price', 4, 2);
      table.timestamps();
    }).then(function(){
      console.log('created foods'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('foods')
      .then(function(){
        console.log('dropped foods'.red);
      })
    ;

  }
};

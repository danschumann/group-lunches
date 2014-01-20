module.exports = {

  title: 'Create orders table',

  up: function(data){

    return data.schema.createTable('orders', function(table){
      table.increments('id').primary();
      table.integer('lunch_id');
      table.integer('user_id');
      table.decimal('price', 5, 2); // total for all foods connected to this order
      table.decimal('paid', 5, 2);
      table.timestamps();
    }).then(function(){
      console.log('created orders'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('orders')
      .then(function(){
        console.log('dropped orders'.red);
      })
    ;

  }
};

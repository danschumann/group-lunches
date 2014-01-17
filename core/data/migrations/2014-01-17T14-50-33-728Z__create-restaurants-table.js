module.exports = {

  title: 'Create restaurants table',

  up: function(data){

    return data.schema.createTable('restaurants', function(table){
      table.increments('id').primary();
      table.string('name').unique();
      table.string('menu_url');
      table.text('notes');
    }).then(function(){
      console.log('created restaurants'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('restaurants')
      .then(function(){
        console.log('dropped restaurants'.red);
      })
    ;

  }
};

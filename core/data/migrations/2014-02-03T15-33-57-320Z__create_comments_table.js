module.exports = {

  title: 'Create comments table',

  up: function(data){

    return data.schema.createTable('comments', function(table){
      table.increments('id').primary();
      table.integer('lunch_id');
      table.integer('user_id');
      table.text('content');
    }).then(function(){
      console.log('created comments'.green);
    });

  },

  down: function(data){

    return data.schema.dropTable('comments')
      .then(function(){
        console.log('dropped comments'.red);
      })
    ;

  }
};

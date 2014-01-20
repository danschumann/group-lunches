module.exports = {

  title: 'add closed to lunches table',

  up: function(data){

    return data.schema.table('lunches', function(table){
      table.boolean('closed').after('name');
    }).then(function(){
      console.log('added closed'.green);
    });

  },

  down: function(data){

    return data.schema.table('lunches', function(table){
      table.dropColumn('closed');
    }).then(function(){
      console.log('dropped closed'.green);
    });

  }
};

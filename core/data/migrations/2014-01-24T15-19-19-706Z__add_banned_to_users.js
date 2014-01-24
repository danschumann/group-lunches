module.exports = {

  title: 'add banned to users table',

  up: function(data){

    return data.schema.table('users', function(table){
      table.boolean('banned');
    }).then(function(){
      console.log('added banned'.green);
    });

  },

  down: function(data){

    return data.schema.table('users', function(table){
      table.dropColumn('banned');
    }).then(function(){
      console.log('dropped banned'.green);
    });

  }
};

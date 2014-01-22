module.exports = {

  title: 'add food_arrived to lunches table',

  up: function(data) {

    return data.schema.table('lunches', function(table) {
      table.boolean('food_arrived').after('closed');
    }).then(function() {
      console.log('added food_arrived'.green);
    });

  },

  down: function(data) {

    return data.schema.table('lunches', function(table){
      table.dropColumn('food_arrived');
    }).then(function(){
      console.log('dropped food_arrived'.green);
    });

  }
};

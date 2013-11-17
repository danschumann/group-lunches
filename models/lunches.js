_ = require('underscore');
fs = require('fs');
// We just use a flat file since we don't expect a lot of traffic
var lunches;
try{
  lunches = JSON.parse(fs.readFileSync('models/data/lunches.txt').toString());
} catch(er){
  lunches = []
}

GLOBAL.Lunch = function(attributes){
  if (!_.isObject(attributes))
    attributes = {}
  attributes.id = attributes.id || lunches.length
  this.attributes = attributes;
};

Lunch.prototype.save = function(){

  var existing = _.findWhere(lunches, {id: this.id});
  if (existing) 
    _.extend(existing, this.attributes);
  else
    lunches.push(this.attributes);

  fs.writeFileSync('models/data/lunches.txt', JSON.stringify(lunches));

};

Lunch.find = function(id) {
  return _.findWhere(lunches, {id:id});  
};

lunch = new Lunch({food:'yes please', id: 123});
lunch.save()
found_lunch = Lunch.find(123);
console.log(found_lunch);

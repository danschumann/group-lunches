_ = require('underscore');
fs = require('fs');

// Ensure directory
try{ fs.mkdirSync('models/data'); } catch(er){}

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

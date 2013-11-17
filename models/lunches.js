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

crypto = require('crypto')
gen_id = function(){
  return crypto.randomBytes(16).toString('hex')
}

GLOBAL.Lunch = function(attributes){
  if (!_.isObject(attributes))
    attributes = {}

  if (!attributes.id){

    id = gen_id();
    while(_.findWhere({id: id}))
      id = gen_id()
    attributes.id = id
  }

  this.attributes = attributes;
};

Lunch.prototype.save = function(){

  var existing = _.findWhere(lunches, {id: this.attributes.id});
  if (existing) 
    _.extend(existing, this.attributes);
  else
    lunches.push(this.attributes);

  fs.writeFileSync('models/data/lunches.txt', JSON.stringify(lunches));

};

Lunch.find = function(id) {
  return new Lunch(_.findWhere(lunches, {id:id}));  
};


Lunch.prototype.findOrders = function(){
	return _.where(Order.collection, {lunch_id:this.attributes.id});
}

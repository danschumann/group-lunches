_ = require('underscore');
fs = require('fs');

// Ensure directory
try{ fs.mkdirSync('models/data'); } catch(er){}

// We just use a flat file since we don't expect a lot of traffic
var orders;
try{
  orders = JSON.parse(fs.readFileSync('models/data/orders.txt').toString());
} catch(er){
  orders = []
}

GLOBAL.Order = function(attributes){
  if (!_.isObject(attributes))
    attributes = {}
  attributes.id = attributes.id || orders.length
  this.attributes = attributes;
};

Order.prototype.save = function(){

  var existing = _.findWhere(orders, {id: this.id});
  if (existing) 
    _.extend(existing, this.attributes);
  else
    orders.push(this.attributes);

  fs.writeFileSync('models/data/orders.txt', JSON.stringify(orders));

};

Order.find = function(id) {
  return _.findWhere(orders, {id:id});  
};

Order.findForLunch = function(lunchId){
	return _.where(orders, {lunch_id:lunchId})
}

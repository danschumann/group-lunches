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

crypto = require('crypto')
gen_id = function(){
  return crypto.randomBytes(16).toString('hex')
}

GLOBAL.Order = function(attributes){
  if (!_.isObject(attributes))
    attributes = {}

  if (!attributes.id){

    id = gen_id();
    while(_.findWhere(orders, {id: id}))
      id = gen_id()
    attributes.id = id
  }

  this.attributes = attributes;
};

Order.collection = orders;

Order.prototype.save = function(){

  var existing = _.findWhere(orders, {id: this.attributes.id});
  console.log('is exist', existing);
  if (existing) 
    _.extend(existing, this.attributes);
  else
    orders.push(this.attributes);

  fs.writeFileSync('models/data/orders.txt', JSON.stringify(orders));

};

Order.find = function(id) {
  var order = _.findWhere(orders, {id:id})
  if (order) return new Order(order);  
};

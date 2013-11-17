
/**
 * Module dependencies.
 */

GLOBAL.SERVER_HOST = 'localhost'
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var lunch = require('./routes/lunch');
var http = require('http');
var path = require('path');
require('./models/lunches');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({secret:'asdfdsfajkfadsjf ksjdfkadsfasdfkjasldfjalsdfj'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/newlunch', lunch.newlunch);
app.get('/addorder', lunch.addorder);
app.post('/lunch', lunch.post_lunch);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

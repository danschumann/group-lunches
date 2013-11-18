GLOBAL.SERVER_HOST = 'localhost'
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

// TODO: Use any database other than this
require('./models/lunches');
require('./models/order');

require('./lib/string_helper.js')

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


require('./config/routes')(app);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Lunch food orders serving on port: ' + app.get('port'));
});

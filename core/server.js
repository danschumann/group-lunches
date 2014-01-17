var
  Server, server,

  express     = require('express'),
  config      = require('./lib/config-loader'),

  loaddir     = require('loaddir'),
  pm          = require('print-messages'),
  when        = require('when'),
  ECT         = require('ect'),
  join        = require('path').join,
  ectRenderer = ECT({watch: true, root: __dirname + '/views'}),

  middleware  = loaddir({
    path: join(__dirname, '/middleware'),
    require: true,
  }),

  routers     = loaddir({
    path: join(__dirname, '/routers'),
    require: true,
  });
 
Server = function(){

  if (server) return server;
  if (!(this instanceof Server)) return new Server();

  var app = this.app;

  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.cookieParser());
  app.use(express.cookieSession({ secret: config.server.cookieSecret }));

  app.use(middleware.resolveId);
  app.use(middleware.locals);
  app.use(middleware.errors);
  app.use(middleware.revalidate);

  //
  // Compiling Assets
  //
  
  //
  // Backend templates
  //   adds res.view() as an extension of res.render()
  app.use(middleware.view);
  
  // Frontend -- Coffeescript files
  //app.use(middleware.coffeescript({ src: __dirname + '/frontend'}));

  // Frontend -- Stylesheets
  app.use(middleware.stylus({ src: __dirname + '/stylesheets' }));
  
  // Frontend -- Templates
  app.use(middleware.frontend_templates);

  // Static
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/vendor'));

  // Views
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ect.html');
  // Viewing as html helps out syntax highlighting
  app.engine('ect.html', ectRenderer.render);

  //
  // Routes
  //
  routers.frontend(app);
  routers.api     (app);
  routers.admin   (app);

  return server = this;

};

// Putting app on the prototype helps clean up console logs of server
Server.prototype.app = express();

Server.prototype.listen = function(){
  var deferred = when.defer();

  // Compact because we may or may not have a host specified
  args = _.compact([config.server.port, config.server.host, function(){

    pm.log('Server listening on port ', config.server.port);
    deferred.resolve(server);

  }]);

  server.app.listen.apply(server.app, args);

  return deferred.promise;
};
    
module.exports = Server;

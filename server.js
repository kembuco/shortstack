var express = require('express')
  , http = require('http')
  , browserify = require('browserify');

var app = express();

app.configure(function(){
  var RedisStore = require('connect-redis')(express);

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: "application-secret", store: new RedisStore}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(browserify({entry: __dirname + '/public/javascripts/app.js', watch: true, debug: true}));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(browserify(__dirname + '/public/javascripts/app.js'));
    app.use(express.errorHandler()); 
});

require('./routes')(app);
require('./lib/email').init(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
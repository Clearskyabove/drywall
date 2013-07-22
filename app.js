//dependencies
var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , toobusy = require('toobusy')
;

//create express app
var app = express();

//mongo uri
app.set('mongodb-uri', process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/drywall');

//setup mongoose
app.db = mongoose.createConnection(app.get('mongodb-uri'));
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  console.log('mongoose open for business');
});

//config data models
require('./models')(app, mongoose);

//config all
app.configure(function(){
  //settings
  app.disable('x-powered-by');
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('strict routing', true);
  app.set('project-name', 'Drywall.js');
  app.set('company-name', 'Acme, Inc.');
  app.set('admin-email', 'your@email.addy');

  app.set('strong-slow-crypto', false); //uses bcrypt and per-user salts
  app.set('crypto-key', 'k3yb0ardc4t'); //not used when strong-slow-crypto = true

  //email (smtp) settings
  app.set('email-from-name', app.get('project-name')+ ' Website');
  app.set('email-from-address', 'your@email.addy');
  app.set('email-credentials', {
    user: 'your@email.addy',
    password: 'bl4rg!',
    host: 'smtp.gmail.com',
    ssl: true
  });

  //twitter settings
  app.set('twitter-oauth-key', '');
  app.set('twitter-oauth-secret', '');

  //github settings
  app.set('github-oauth-key', '');
  app.set('github-oauth-secret', '');

  //facebook settings
  app.set('facebook-oauth-key', '');
  app.set('facebook-oauth-secret', '');

  // As an alternative set config externally in 'config.json' placed in the root of your project.
  // This overwrites the settings above for all defined key. 
  // Useful for project management stuff, git remote pushes among other things in which 
  // you likely don't want to expose sensitive info: doing a gitignore on config.json and you're done.
  // NOTE: 
  var externalconfig = require("./config.json");
  if(externalconfig){
    for (var key in externalconfig) {
      app.set(key,externalconfig[key]);
    }
    //the following should take precedence
    if(process.env.PORT){
      app.set('port', process.env.PORT);
    }
    if(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL){
       app.set('mongodb-uri', process.env.MONGOLAB_URI || process.env.MONGOHQ_URL);
    }
  }

  //middleware

  //https://hacks.mozilla.org/2013/01/building-a-node-js-server-that-wont-melt-a-node-js-holiday-season-part-5/
  app.use(function(req, res, next) {
    // check if we're toobusy() - note, this call is extremely fast, and returns
    // state that is cached at a fixed interval
    if (toobusy()) res.send(503, "I'm busy right now, sorry.");
    else next();
  });
  
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'Sup3rS3cr3tK3y',
    store: new mongoStore({ url: app.get('mongodb-uri') })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  //error handler
  app.use(require('./views/http/index').http500);

  //locals
  app.locals.projectName = app.get('project-name');
  app.locals.copyrightYear = new Date().getFullYear();
  app.locals.copyrightName = app.get('company-name');
});

//config dev
app.configure('development', function(){
  app.use(express.errorHandler());
});

//config passport
require('./passport')(app, passport);

//route requests
require('./routes')(app, passport);

//utilities
require('./utilities')(app);

//listen up
http.createServer(app).listen(app.get('port'), function(){
  console.log('express server listening on port ' + app.get('port'));
});

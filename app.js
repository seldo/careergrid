
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport')
var mongoose = require('mongoose')
var requireAll = require('require-all')
var connect = require('connect')
var expressSanitizer = require('./lib/express-sanitizer')
var csrf = require('csrf')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser())
app.use(connect.bodyParser())
app.use(expressSanitizer())
app.use(express.session({secret:'WTFBBQLOL'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(csrf());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// connect to DB
mongoose.connect('mongodb://localhost/careergrid');
var db = mongoose.connection;
db.on('error', function(er) { console.log('connection error:' + er) });
db.once('open', function callback () {
  console.log("Connected!")
});

// load controllers
var controllers = requireAll(__dirname + '/controllers');

// load models
var User = require('./models/user')

// define authentication strategy and helpers
var auth = require('./authentication')(passport,User)

// define routes
app.get('/', controllers.index.index);
app.post('/grid/build', controllers.grid.build);
app.get('/grid/save', auth.requireLogin, controllers.grid.postImage);
app.post('/grid/save', auth.requireLogin, controllers.grid.saveImage);
app.get('/grid/:id', auth.requireLogin, controllers.grid.build);
app.get('/login', controllers.user.login )
app.post('/login', passport.authenticate('local'), auth.postLogin);
app.get('/signup', controllers.user.showCreate ) // we're not using this
app.post('/signup', controllers.user.create);
app.get('/user/twitter/authenticate', passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  }
);
app.get('/user/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.render('user/twitter-done');
  }
);

// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

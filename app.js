
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

// load controllers
var controllers = requireAll(__dirname + '/controllers');

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
app.use(passport.initialize())
app.use(passport.session())
//app.use(express.session({secret:'WTFBBQLOL'}))
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// connect to DB
mongoose.connect('mongodb://localhost/careergrid');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected!")
});

var UserSchema = mongoose.Schema({
  name: String,
  username: String
})
var User = mongoose.model('User', UserSchema)

// define authentication strategy
require('./authentication.js')(passport,User)

// define routes
app.get('/', controllers.index.index);
app.post('/grid', controllers.index.build);
app.get('/grid/:id', controllers.index.build);
app.get('/save', controllers.index.save);

// start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

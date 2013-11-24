
/**
 * Module dependencies.
 */

var express = require('express');
var controllers = require('./controllers');
var http = require('http');
var path = require('path');
var passport = require('passport')
var TwitterStrategy = require('passport-twitter')


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.cookieParser())
app.use(express.bodyParser())
app.use(express.session({secret:'WTFBBQLOL'}))
app.use()
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', controllers.index);
app.get('/build', routes.build);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
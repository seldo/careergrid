var LocalStrategy = require('passport-local').Strategy
var TwitterStrategy = require('passport-twitter').Strategy
var config = require('./config')
var bcrypt = require('bcrypt')

module.exports = function(passport,User) {
  // local user strategy
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findByName(username, function (err, user) {
        console.log("Found a user:")
        console.log(user)
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        user.validatePassword(password,function(er,valid) {
          if (er) { return done(er); }
          if (valid) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect password.' });
          }
        })
      });
    }
  ));
  // twitter auth strategy
  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      bcrypt.genSalt(10, function(er, randomPass) {
        if (er) throw new Error(er)
        var twitterUser = {
          username: 'twitter__' + profile.id,
          password: randomPass
        }
        User.findOrCreate(twitterUser, function(er, user) {
          if (er) { return done(er); }
          done(null, user);
        });
      })
    }
  ));


  // define user serialize/deserialize
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  return {
    // middleware to be applied to any route that requires login
    requireLogin: function(req,res,next) {
      // `req.user` contains the authenticated user.
      if(!req.user) {
        console.log("No authenticated user found")
        // if we need them to login, we have to say where to come back to afterwards
        return res.redirect('/login?done=' + req.path);
      } else {
        console.log("Authenticated user:")
        console.log(req.user)
        return next()
      }
    },
    // happens after a successful authentication; send them somewhere.
    postLogin: function(req, res) {
      // the ?done parameter from above gets transmitted through to here
      var done = '/'
      if(req.body.done) {
        // require a relative URL: starts with / but second char is not also /
        if (req.body.done.indexOf('/') === 0 && req.body.done.indexOf('/',1) !== 1) {
          done = req.body.done
        }
      }
      res.redirect(done);
    }
  }

}
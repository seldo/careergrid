var LocalStrategy = require('passport-local').Strategy
var TwitterStrategy = require('passport-twitter').Strategy

module.exports = function(passport,User) {
  // define passport strategies
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
        return res.redirect('/login');
      } else {
        console.log("Authenticated user:")
        console.log(req.user)
        return next()
      }
    }
  }

}
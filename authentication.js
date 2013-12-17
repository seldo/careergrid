var LocalStrategy = require('passport-local').Strategy
var TwitterStrategy = require('passport-twitter').Strategy

module.exports = function(passport) {
  // define passport strategies
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findByName(username, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

}
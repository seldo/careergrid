var passport = require('passport')
var User = require('../models/user')

exports.login = function(req, res) {
  res.render('user/login', {
    // filtered for nasties by expressSanitizer, so safe to output
    // BUT could still be a redirect to a random website, so check that later
    done: req.query.done,
    _csrf: req.session._csrf
  })
};

exports.showCreate = function(req,res) {
  // we don't use this, but we could if we wanted to
}

exports.create = function(req,res,next) {
  // where we do go afterwards?
  var done = '/'
  if (req.body.done.indexOf('/') === 0 && req.body.done.indexOf('/',1) !== 1) {
    done = req.body.done
  }

  // if passwords don't match, no signup
  if (req.body.password != req.body['password-repeat']) {
    // TODO: flash message
    return res.redirect('/login?signuperror=passwordmismatch')
  }

  // create the user
  var user = new User({
    username: req.body.username,
    password: req.body.password
  })
  user.save(function(er) {
    if (er) {
      return res.redirect('/login?signuperror='+er)
    } else {
      // log them in and then send them on their way
      passport.authenticate('local')(req,res,function() {
        return res.redirect(done)
      })
    }
  })

}
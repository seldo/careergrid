var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var UserSchema = mongoose.Schema({
  name: String,
  username: String,
  password: String, // this is bad, as it creates an empty key in every record
  passwordHash: String
})

UserSchema.statics.findByName = function(username,cb) {
  this.findOne({username: new RegExp(username,'i') },cb)
}

UserSchema.statics.findOrCreate = function(user,cb) {
  this.findByName({username: user.username},function(er,user) {
    if (er) throw new Error(er)
    if (user) cb(null,user)
    else {
      var newUser = new User(user)
      newUser.save(function(er) {
        if (er) throw new Error(er)
        cb(null,newUser)
      })
    }
  })
}

UserSchema.methods = {
  validatePassword: function(password,cb) {
    bcrypt.compare(password, this.passwordHash, cb);
  }
}

UserSchema.pre('save',function(next,done) {
  var user = this
  // validate username unique
  User.findOne({username : user.username},function(er, dupeUser) {
      if(er) {
        console.log("Some kind of error")
        done(er);
      } else if(dupeUser) {
        console.log("Username exists, screw you")
        user.invalidate("Duplicate username")
        done(new Error("Username already exists"))
      } else {
        saltAndHashPass()
      }
  })

  // salt and hash password
  var saltAndHashPass = function() {
    if (user.password) {
      bcrypt.genSalt(10, function(er, salt) {
        bcrypt.hash(user.password, salt, function(er, hash) {
          if (er) {
            throw new Error(er)
          } else {
            user.passwordHash = hash
            user.password = null
            next()
          }
        });
      });
    } else {
      user.invalidate("No password!")
      done(new Error("No password supplied"))
    }
  }
})

var User = mongoose.model('User', UserSchema)

module.exports = User;
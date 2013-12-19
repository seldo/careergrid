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

UserSchema.methods = {
  validatePassword: function(password,cb) {
    bcrypt.compare(password, this.passwordHash, cb);
  }
}

UserSchema.pre('save',function(next) {
  console.log(this)
  var user = this
  if (user.password) {
    bcrypt.genSalt(10, function(er, salt) {
      bcrypt.hash(user.password, salt, function(er, hash) {
        if (er) {
          console.log("Problem hashing:")
          console.log(er)
          throw new Error(er)
        } else {
          user.passwordHash = hash
          user.password = null
          next()
        }
      });
    });
  } else {
    console.log("No password!")
    next()
  }
})

var User = mongoose.model('User', UserSchema)

module.exports = User;
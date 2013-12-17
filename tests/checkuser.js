var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/careergrid');

var db = mongoose.connection;
db.on('error', function() {
  console.log('connection error:')
});

var checkPassword = 'monkey'

db.once('open', function() {

  var User = require('../models/user')

  // check a user's password
  User.findByName('seldo',function(er,user) {

    if(user) {
      user.validPassword(checkPassword,function(valid) {
        if(valid == true) {
          console.log("Valid password!")
        } else {
          console.log("Invalid password")
        }
      })
    } else {
      console.log("Did not find user")
    }

    db.close()
  })

});
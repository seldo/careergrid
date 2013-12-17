var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/careergrid');

var db = mongoose.connection;
db.on('error', function() {
  console.log('connection error:')
});

db.once('open', function() {

  var User = require('../models/user')

  // find a user
  User.findByName('seldo',function(er,user) {

    if(user) {
      console.log("Found user:")
      console.log(user)
    } else {
      console.log("Did not find user")
    }

    db.close()
  })

});
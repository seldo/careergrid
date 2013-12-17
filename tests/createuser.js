var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/careergrid');

var db = mongoose.connection;
db.on('error', function() {
  console.log('connection error:')
});

db.once('open', function() {

  var User = require('../models/user')

  // create a user
  var user = new User({
    name: 'Laurie Voss',
    username: 'seldo',
    password: 'monkey' // the 6th-most common password in the world
  })
  user.save(function(er) {
    if(er) {
      console.log("error: ")
      console.log(er)
    } else {
      console.log("Created user!")
      console.log(user)
      db.close()
    }
  })

});
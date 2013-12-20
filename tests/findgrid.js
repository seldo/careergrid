var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/careergrid');

var db = mongoose.connection;
db.on('error', function() {
  console.log('connection error:')
});

db.once('open', function() {

  var Grid = require('../models/grid')

  // find a grid
  Grid.findByShortId('test','test',function(er,grid) {

    if(grid) {
      console.log("Found grid:")
      console.log(grid)
    } else {
      console.log("Did not find grid")
      console.log(er)
    }

    db.close()
  })

});
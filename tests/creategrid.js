var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/careergrid');

var db = mongoose.connection;
db.on('error', function() {
  console.log('connection error:')
});

db.once('open', function() {

  var Grid = require('../models/grid')

  // create a grid
  var grid = new Grid({
    user_id: 'test',
    short_id: 'test',
    start: '2000',
    end: '2013',
    skills: [
      {
        name: 'skill1',
        intensities: [0,1,2,3,4]
      },
      {
        name: 'skill2',
        intensities: [5,6,7,8,9]
      }
    ]
  })
  grid.save(function(er) {
    if(er) {
      console.log("error: ")
      console.log(er)
    } else {
      console.log("Grid created")
      console.log(grid)
    }
    db.close()
  })

});
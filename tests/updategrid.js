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

      var newGrid = {
        user_id: grid.user_id,
        short_id: grid.short_id,
        start: grid.start,
        end: grid.end,
        skills: grid.skills
      }
      newGrid.skills[0] = {
        name: 'updatedskill',
        intensities: [0,0,0,0,1,1,1,1,2,2,2,2]
      }
      newGrid.skills.push({
        name: 'newskill',
        intensities: [4,5,8,9,7,6,3]
      })

      // now update it
      Grid.updateByShortId('test','test',newGrid,function(er,updated) {
        if (er) {
          console.log("Error updating grid")
          console.log(er)
        } else {
          console.log("Grid updated successfully")
          console.log(updated)
        }
      })

    } else {
      console.log("Did not find grid")
      console.log(er)
    }

    db.close()
  })

});
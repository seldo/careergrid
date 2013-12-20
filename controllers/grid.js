var Grid = require('../models/grid')
var shortid = require('shortid')

// grid builder
exports.build = function(req, res) {

  var skills = []
  var start, end, shortId = null;

  var done = function() {
    res.render('grid/build', {
      start: start,
      end: end,
      shortId: shortId,
      skills: skills
    })
  }

  if(req.params.id) {
    // load existing grid
    Grid.findByShortId(req.user.id,req.params.id,function(er,gridData) {
      console.log("Existing grid:")
      console.log(gridData.skills)
      start = gridData.start
      end = gridData.end
      skills = gridData.skills
      shortId = gridData.short_id
      done()
    })
  } else {
    // new grid
    start = req.body.start
    end = req.body.end
    req.body.skills.forEach(function(skill,index) {
      skills.push({
        name: skill,
        intensities: Array(end-start)
      })
    })
    done()
  }

}

// get the data out of localstorage
exports.postImage = function(req,res) {
  res.render('grid/postImage',{
    _csrf: req.session._csrf
  })
}

// take the posted data and save to mongo, associated with current user
exports.saveImage = function(req,res) {

  console.log("Save form says: ")
  console.log(req.body['json-data'])

  var gridData = JSON.parse(req.body['json-data'])

  var done = function(id) {
    return res.redirect("/grid/" + id)
  }

  if(gridData.shortId) {
    console.log("Updating grid::")
    gridData.user_id = req.user.id
    gridData.short_id = gridData.shortId
    delete gridData.shortId
    // existing grid
    Grid.updateByShortId(req.user.id,gridData.short_id,gridData,function(er,updated) {
      if (er) throw new Error(er)
      else {
        console.log("update success:")
        console.log(updated.skills)
        done(gridData.short_id)
      }
    })
  } else {
    // new record
    gridData.short_id = shortid.generate()
    gridData.user_id = req.user.id
    var grid = new Grid(gridData)
    grid.save(function(er) {
      done(grid.short_id)
    })
  }
}
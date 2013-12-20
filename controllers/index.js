var _ = require('underscore')
var Grid = require('../models/grid')
var shortid = require('shortid')

// homepage
exports.index = function(req, res) {

  res.render('index', {
    skills: {
      'Frontend': ['CSS','HTML','JavaScript'],
      'Application': ['PHP','Python','Ruby','Java']
      /*
      'Frameworks': ['Rails','Sinatra','Express','Django','Flask','Zend'],
      'Data store': ['SQL','MySQL','Postgres','Oracle','MongoDB','Redis'],
      'Operations': ['Apache','Nginx','HAProxy','Memcache','RabbitMQ','Bash']
      */
    },
    _csrf: req.session._csrf
  })
};

// grid builder
exports.build = function(req, res) {

  console.log("ID:" + req.params.id)
  var skills = []
  var start, end;

  var done = function() {
    res.render('build', {
      start: start,
      end: end,
      skills: skills
    })
  }

  if(req.params.id) {
    // load existing grid
    Grid.findByShortId(req.user.id,req.params.id,function(er,gridData) {
      start = gridData.start
      end = gridData.end
      skills = gridData.skills
      done()
    })
  } else {
    // new grid
    start = req.body.start
    end = req.body.end
    req.body.skills.forEach(function(skill,index) {
      skills.push({
        name: skill,
        intensities: []
      })
    })
    done()
  }

}

// get the data out of localstorage
exports.postImage = function(req,res) {
  res.render('postImage',{
    _csrf: req.session._csrf
  })
}

// take the posted data and save to mongo, associated with current user
exports.saveImage = function(req,res) {

  console.log("Save form says: ")
  console.log(req.body['json-data'])

  var gridData = JSON.parse(req.body['json-data'])
  gridData.short_id = shortid.generate()
  gridData.user_id = req.user.id

  var grid = new Grid(gridData)
  grid.save(function(er) {
    res.redirect("/grid/" + grid.short_id)
  })

  return
}
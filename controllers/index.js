var _ = require('underscore')
var  = require('../models/user')

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

  if(req.params.id) {
    // load existing grid
    start = 2001
    end = 2005
  } else {
    // new grid
    start = req.body.start
    end = req.body.end
    req.body.skills.forEach(function(skill,index) {
      var skillParts = skill.split(':')
      skills.push({
        category: skillParts[0],
        name: skillParts[1],
        id: skillParts[0]+'_'+skillParts[1]
      })
    })
  }

  res.render('build', {
    start: start,
    end: end,
    skills: skills
  })
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

  // do that stuff
  var id = 'xxx'

  return res.redirect("/grid/" + id)
}
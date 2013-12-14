var _ = require('underscore')

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
    }
  })
};

// grid builder
exports.build = function(req, res) {
  // process skill list
  var skills = []
  req.body.skills.forEach(function(skill,index) {
    var skillParts = skill.split(':')
    skills.push({
      category: skillParts[0],
      name: skillParts[1],
      id: skillParts[0]+'_'+skillParts[1]
    })
  })

  res.render('build', {
    start: req.body.start,
    end: req.body.end,
    skills: skills
  })
}

// save the png
exports.save = function(req,res) {

  // if has session already, show image

  // if no session, show login/create screen

}
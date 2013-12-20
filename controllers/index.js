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


var san = require('sanitizer')
var typeOf = require('./lib/typeof')
var extend = require('extend')

exports = module.exports = function(options) {

  // some options would be nice

  // recursively sanitize everything
  var cleanKeys = function(obj) {
    var type = typeOf(obj)
    if(type == 'object') {
      for(var key in obj) {
        obj[key] = cleanKeys(obj[key])
      }
    } else if (type == 'array') {
      for(var i = 0; i < obj.length; i++) {
        obj[i] = cleanKeys(obj[i])
      }
    } else {
      obj = san.sanitize(obj)
    }
    return obj
  }

  return function sanitizer(req,res,next) {

    if (!req.body) next()

    // if you really want unsanitized input, you have to ask for it
    req.unsafeBody = extend(true,{},req.body)

    // by default everything is sanitized all the way down
    req.body = cleanKeys(req.body)

    next()

  }

}
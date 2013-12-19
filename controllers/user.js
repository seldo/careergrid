
/*
 * GET users listing.
 */

exports.login = function(req, res){
  res.render('user/login', {
    _csrf: req.session._csrf
  })
};
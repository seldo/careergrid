
/*
 * GET users listing.
 */

exports.login = function(req, res){

  console.log(req.query)

  res.render('user/login', {
    // filtered for nasties by expressSanitizer, so safe to output
    // BUT could still be a redirect to a random website, so check that later
    done: req.query.done,
    _csrf: req.session._csrf
  })
};
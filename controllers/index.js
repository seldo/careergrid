
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
    title: 'Welcome to CareerGrid&trade;!'
  });
};

exports.build = function(req, res){
  // In reality we would sanitize the fuck out of this input
  res.render('build', {
    start: req.param('start'),
    end: req.param('end')
  })
}
var express = require('express');
var home = require('./home'),
    posts = require('./posts'),
    users = require('./users'),
    router = express.Router();

router.use('/', home);
router.use('/api/users', users);
router.use('/api/posts', posts);

  // app.post('/twitter/user', twitter.getUserData);

  // app.all('/api/*', function(req, res){
  //   res.send(404);
  // });
  

module.exports = router;

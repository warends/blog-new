var express = require('express');
var home = require('./home'),
    posts = require('./posts'),
    users = require('./users'),
    router = express.Router();

router.use('/', home);
router.use('/api/users', users);
router.use('/api/posts', posts);

  // app.get('/partials/*', function(req, res){
  //     res.render('../../public/app/' + req.params[0]);
  // });

  // app.post('/login', auth.authenticate);
  //
  // app.post('/contact-form', contact.sendMail);
  //
  // app.post('/twitter/user', twitter.getUserData);
  //
  // app.post('/logout', function (req, res) {
  //   req.logout();
  //   res.end();
  // });

  // app.all('/api/*', function(req, res){
  //   res.send(404);
  // });

  // app.get('*', function(req, res){
  //   res.render('index', {
  //     bootstrappedUser : req.user
  //   });
  // });

module.exports = router;

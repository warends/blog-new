var express = require('express'),
    auth = require('../config/auth'),
    contact = require('../controllers/contact'),
    router = express.Router();

router.get('/partials/*', function(req, res){
    res.render('../../public/app/' + req.params[0]);
});

router.get('/', function(req, res){
  res.render('index', {
    bootstrappedUser : req.user
  });
});

// app.all('/api/*', function(req, res){
//   res.send(404);
// });

// router.post('/login', auth.authenticate);
//
// router.post('/contact-form', contact.sendMail);
//
// router.post('/logout', function (req, res) {
//   req.logout();
//   res.end();
// });



module.exports = router;

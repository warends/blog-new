var auth = require('./auth'),
    users = require('../controllers/users'),
    posts = require('../controllers/posts'),
    contact = require('../controllers/contact'),
    twitter = require('./twitter'),
    mongoose = require('mongoose');

module.exports = function(app){

  // app.use('multer'({ dest: '../../public/uploads/img',
  //   rename: fuction (fieldname, filename){
  //     retun filename;
  //   }
  // }));

  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  app.post('/api/users', users.createUser);
  app.put('/api/users', users.updateUser);

  app.get('/api/posts', posts.getPosts);
  app.post('/api/posts', posts.createPost);
  app.get('/api/posts/:id', posts.getPostById);

  app.get('/partials/*', function(req, res){
      res.render('../../public/app/' + req.params[0]);
  });

  app.post('/login', auth.authenticate);

  app.post('/contact-form', contact.sendMail);

  app.post('/twitter/user', twitter.getUserData);

  app.post('/logout', function (req, res) {
    req.logout();
    res.end();
  });

  app.all('/api/*', function(req, res){
    res.send(404);
  });

  app.get('*', function(req, res){
    res.render('index', {
      bootstrappedUser : req.user
    });
  });

}

var express = require('express'),
    router = express.Router(),
    auth = require('../config/auth'),
    encryption = require('../utilities/encryption'),
    User = require('../models/User').User;

//get Users
router.get('/', auth.requiresRole('admin'), function(req, res){
  User.find({}).exec(function(err, response){
    res.send(response);
  });
});

//create user
router.post('/', function(req, res){
  var userData = req.body;
  userData.username = userData.username.toLowerCase();
  userData.salt = encryption.createSalt();
  userData.hashed_pwd = encryption.hashPwd(userData.salt, userData.password);
  User.create(userData, function(err, user){
    if(err) {
      if(err.toString().indexOf('E11000') > -1 ){
        err = new Error('Duplicate Username');
      }
      res.status(400);
      return res.send(err.toString());
    }
    req.logIn(user, function(err){
      if(err) {return next(err);}
      res.send(user);
    });

  });
});

//update user
router.put('/', function(req, res){
  var userUpdates = req.body;
  if(req.user._id != userUpdates._id && !req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }

  req.user.firstName = userUpdates.firstName;
  req.user.lastName = userUpdates.lastName;
  req.user.username = userUpdates.username;
  if(userUpdates.password && userUpdates.password.length > 0){
    req.user.sale = encryption.createSalt();
    req.user.hashed_pwd = encryption.hashPwd(req.user.sale, userUpdates.password);
  }
  req.user.save(function(err){
    if(err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
      res.send(req.user);
  });

});

module.exports = router;

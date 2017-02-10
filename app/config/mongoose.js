var mongoose = require('mongoose'),
    User = require('../models/User');
    Post = require('../models/Post');

module.exports = function(config){

  mongoose.Promise = global.Promise;
  mongoose.connect(config.db);

  var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error...'));
      db.once('open', function callback(){
        console.log('App DB Connected');
      });


      // userModel.createDefaultUser();
      Post.createDefaultComment();

}

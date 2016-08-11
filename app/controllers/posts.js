var Post = require('mongoose').model('Post');

exports.getPosts = function(req, res){
  Post.find({}).exec(function(err, collection){
    res.send(collection);
  })
};

exports.getPostById = function(req, res){
  Post.findOne({_id:req.params.id}).exec(function(err, post){
    res.send(post);

  });
};

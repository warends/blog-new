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

exports.createPost = function(req, res, next) {

  var postData = req.body;
  Post.create(postData, function(err, post){
    if(err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    //res.send(post);
  });

};

exports.updatePost = function(req, res){
  var updatedPost = req.body;
  req.post.title = updatedPost.title;
  req.post.categories = updatedPost.categories;
  req.post.excerpt = updatedPost.excerpt;
  req.post.body = updatedPost.body;
  req.post.author = updatedPost.author;
  req.post.postedDate = Date.now();

  req.post.save(function(err){
    if(err){
      res.status(400);
      return res.send({reason:err.toString});
    }
    res.send(req.post);
  });
};

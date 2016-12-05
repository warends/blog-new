var Post = require('mongoose').model('Post');

//GET ALL POSTS
exports.getPosts = function(req, res){
  Post.find({}).exec(function(err, collection){
    res.send(collection);
  })
};

//CREATE POST
exports.createPost = function(req, res, next) {
  var postData = req.body;

  Post.create(postData, function(err, post){
    if(err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    res.send(post);
  });
};

//GET POST
exports.getPostById = function(req, res){
  Post.findOne({ _id: req.params.id}).exec(function(err, post){
    res.send(post);
  });
};

//UPDATE POST
exports.updatePost = function(req, res){

  Post.findById(req.params.id, function(err, post){

    if(err) { res.send(err); }

    var updatedPost = req.body;
    post.title = updatedPost.title;
    post.slug = updatedPost.slug;
    post.categories = updatedPost.categories;
    post.excerpt = updatedPost.excerpt;
    post.body = updatedPost.body;
    post.author = updatedPost.author;
    post.postedDate = Date.now();

    post.save(function(err){
      if(err){
        res.send(400);
        return res.send({reason:err.toString()});
      }
      res.send(req.post);
    });

  });
};

//DELETE POST
exports.deletePost = function(req, res){

  Post.remove({
    _id: req.params.id
  }, function(err, post){
    if(err) { res.send(err); }

    res.json({ message: 'Successfully Deleted Post'});
  });

};

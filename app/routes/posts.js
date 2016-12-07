var express = require('express'),
    router = express.Router(),
    Post = require('../models/Post').Post;

//get all posts
router.get('/', function(req, res){
  Post.find({}).exec(function(err, collection){
    if(err){ throw err; }
    res.send(collection);
  })
});

//create post
router.post('/', function(req, res){
  var postData = req.body;

  Post.create(postData, function(err, post){
    if(err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    res.send(post);
  });
});

//update post
router.put('/:id', function(req, res){
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
});

//delete post
router.delete('/:id', function(req, res){
  Post.remove({
    _id: req.params.id
  }, function(err, post){
    if(err) { res.send(err); }

    res.json({ message: 'Successfully Deleted Post'});
  });
});

//get single post
router.get('/:id', function(req, res){
  Post.findOne({ _id: req.params.id}).exec(function(err, post){
    res.send(post);
  });
});


module.exports = router;

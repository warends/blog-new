var express = require('express'),
    router = express.Router(),
    Post = require('../models/Post').Post;

//GET ALL POSTS
router.get('/', function(req, res){
  Post.find({}).exec(function(err, collection){
    if(err){ throw err; }
    res.send(collection);
  })
});

//GET POST
router.get('/:slug', function(req, res){
  Post.findOne({ slug: req.params.slug}).exec(function(err, post){
    res.send(post);
  });
});

//CREATE POST
router.post('/:slug', function(req, res){
  var postData = req.body;
  Post.create(postData, function(err, post){
    if(err) {
      res.status(400);
      return res.send({reason: err.toString()});
    }
    return res.send(post);
  });
});

//DELETE POST
router.delete('/:slug', function(req, res){
  Post.remove({
    slug: req.params.slug
  }, function(err, post){
    if(err) { res.send(err); }
    return res.send('Successfully Deleted Post');
  });
});

//UPDATE POST
router.put('/:slug', function(req, res){
  Post.findOne({'slug': req.params.slug}, function(err, post){

    if(err) { return res.send(err); }

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
        res.sendStatus(400);
        return res.send({reason:err.toString()});
      }
      return res.send(req.post);
    });

  });
});


module.exports = router;

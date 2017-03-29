var express = require('express'),
    router = express.Router(),
    contact = require('../controllers/contact'),
    Post = require('../models/Post').Post;

//GET ALL POSTS
router.get('/', function(req, res){
  Post.find({}).exec(function(err, collection){
    if(err){ throw err; }
    res.send(collection);
  })
});

//CREATE POST
router.post('/:slug', function(req, res){
  var postData = req.body;
  Post.create(postData, function(err, post){
    if(err) {
      res.status(400);
      res.send({message: err.toString()});
    }
    res.send(post);
  });
});

//GET POST
router.get('/:slug', function(req, res){
  Post.findOne({ slug: req.params.slug}).exec(function(err, post){
    if(err) {res.send(err)};
    res.send(post);
  });
});

//DELETE POST
router.delete('/:slug', function(req, res){
  Post.remove({
    slug: req.params.slug
  }, function(err, post){
    if(err) { res.send(err); }
    res.json({message:'Successfully Deleted Post', post});
  });
});

//UPDATE POST
router.put('/:slug', function(req, res){
  Post.findOne({slug : req.params.slug}, function(err, post){
    if(err) { res.send(err); }

    var updatedPost = req.body;
    post.title = updatedPost.title;
    post.slug = updatedPost.slug;
    post.categories = updatedPost.categories;
    post.excerpt = updatedPost.excerpt;
    post.body = updatedPost.body;
    post.author = updatedPost.author;
    post.postedDate = Date.now();
    post.gists = updatedPost.gists;

    post.save(function(err){
      if(err){
        res.sendStatus(400);
        res.send({message: err.toString()});
      }
      res.send(post);
    });

  });
});

//ADD COMMENT
router.post('/comments/:slug', function(req, res){
  Post.findOne({slug : req.params.slug}).exec(function(err, post){
    if(err) res.json(err);

    var newComment = req.body;
    var comment = post.comments.create({
      content: newComment.content,
      date: Date.now(),
      firstName: newComment.firstName,
      lastName: newComment.lastName
    })
    post.comments.push(comment);
    post.save(function(err){
      if(err) throw err;
      var title = post.title;
      contact.newMessage(comment, title);
      res.send({message: comment.fullName});
    });
  });
});

//DELETE A COMMENT
router.put('/comments/:slug', function(req, res){
  Post.findOne({slug : req.params.slug}).exec(function(err, post){
    if(err) res.json(err);

    var commentId = req.body._id;
    var cArray = post.comments;
    var pos = cArray.map(function(comment) { return comment._id.toString(); }).indexOf(commentId);
    cArray.splice(pos, 1);
    post.save(function(err){
      if(err) res.status(400).send({ error: 'Something failed!' })
      res.send({message: (pos+1)});
    });
  });
});

module.exports = router;

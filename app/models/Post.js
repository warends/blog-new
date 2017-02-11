var mongoose = require('mongoose');
    CommentSchema = require('./CommentSchema');

var postSchema = new mongoose.Schema ({
  title: { type: String, required: '{PATH} is required', unique: true },
  slug: {type: String, required: '{PATH} is required', unique: true},
  categories: [String],
  headerImage : {data: Buffer, contentType: String},
  excerpt: { type: String, required: '{PATH} is required' },
  body: { type: String, required: '{PATH} is required' },
  author: { type: String, required: '{PATH} is required' },
  postedDate: { type: Date, default: Date.now},
  comments: [CommentSchema]
});

var Post = mongoose.model('Post', postSchema);


// function createDefaultComment(){
//   var query = {slug: 'what-is-your-process'}
//   Post.findOne(query).exec(function(err, post){
//     console.log(post);
//     var comment = post.comments.create({
//       content: 'This article is sweet!',
//       date: Date.now(),
//       firstName: 'Hayley',
//       lastName: 'Bagwell'
//     })
//     post.comments.push(comment);
//     post.save(function(err){
//       if(err) throw err;
//       console.log(post);
//     });
//   });
// };

module.exports = {
  Post: Post
  //createDefaultComment: createDefaultComment
}

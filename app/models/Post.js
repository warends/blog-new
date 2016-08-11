var mongoose = require('mongoose');

var postSchema = mongoose.Schema ({
  title: { type: String, required: '{PATH} is required', unique: true },
  categories: [String],
  headerImage : {data: Buffer, contentType: String},
  excerpt: { type: String, required: '{PATH} is required' },
  body: { type: String, required: '{PATH} is required' },
  author: { type: String, required: '{PATH} is required' },
  postedDate: { type: Date, default: Date.now}
});

var Post = mongoose.model('Post', postSchema);


function createDefaultPost(){
  Post.find({}).exec(function(err, collection){
    if(collection.length === 0){
      Post.create({
        title: 'Wills First Blog Post',
        categories: ['new', 'awesome'],
        excerpt : 'Here is the first couple lines of text bitches!!!',
        body: 'Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Donec id justo.',
        author: 'Will Arends',
        postedDate: new Date('08/08/16')
      });
    }
  });
};

exports.createDefaultPost = createDefaultPost;

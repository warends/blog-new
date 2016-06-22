var mongoose = require('mongoose');

var postSchema = mongoose.Schema ({
  title: { type: String, required: '{PATH} is required', unique: true },
  categories: { type: String, required: '{PATH} is required' },
  headerImage : {data: Buffer, contentType: String},
  body: { type: String, required: '{PATH} is required' },
  author: { type: String, required: '{PATH} is required' },
  postedDate: { type: Date, default: Date.now}
});

var Post = mongoose.model('Post', postSchema);

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  content: {type: String, required:true},
  date: {type: Date, default: Date.now},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true}
});

module.exports = CommentSchema;

var Mongoose = require('mongoose');
var Member = require('./member');

var commentSchema = new Mongoose.Schema({
  body:     			{ type: String, required: true },
  author:				{ type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'Member' },
  hidden:				{ type: Boolean, default: false },
  created:         		{ type: Date, default: Date.now },
  replies:				[{ type: Mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = Mongoose.model('Comment', commentSchema);
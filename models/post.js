var Mongoose = require('mongoose');
var Member = require('./member');
var Comment = require('./comment');

var postSchema = new Mongoose.Schema({
  subject:             	{ type: String, required: true },
  body:            		{ type: String, required: true },
  tags:             	[{ type: String, required: true }],
  author:				{ type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'Member' },
  hidden:				{ type: Boolean, default: false },
  created:         		{ type: Date, default: Date.now },
  modified:       		{ type: Date },
  comments:				[{ type: Mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = Mongoose.model('Post', postSchema);
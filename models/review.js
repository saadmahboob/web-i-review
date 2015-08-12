var Mongoose = require('mongoose');
var Item = require('./item');
var Member = require('./member');

var reviewSchema = new Mongoose.Schema({
	itemId:    		{ type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'Item'},
	memberId:  		{ type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'Item'},
	rating:			{ type: Number, required: true },
	comment:		{ type: String, default: ""},
	helpfulCount:	{ type: Number, default: 0 },
	notHelpfulCount:{ type: Number, default: 0 }	
});

module.exports = Mongoose.model('Review', reviewSchema);

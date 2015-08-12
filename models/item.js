var Mongoose = require('mongoose');

var itemSchema = new Mongoose.Schema({
	vendorName:		{ type: String, required: true },
	prodName:     	{ type: String, required: true },
	prodDesc:     	{ type: String, required: true },
	SKU:			{ type: String, required: true },
	category:     	{ type: String, required: true },
	price:        	{ type: Number, required: true },
	numRatings:		{ type: Number, default: 0 },
	avgRating:		{ type: Number, default: 0 } 	
});

module.exports = Mongoose.model('Item', itemSchema);
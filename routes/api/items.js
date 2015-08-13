var mongoose = require('mongoose')
var express = require('express');
var router = express.Router();
var Item = require('../../models/item');

// GET Requests
router.get('/', function(req, res) {
  var filter = req.query;

  Item.find(filter).exec(response);

  function response(err, items) {
    res.json(items);
  }
});

router.get('/:SKU', function(req, res) {
  var SKU = req.param('SKU');

  Item.findOne({ SKU: SKU }).exec(response);

  function response(err, item) {
    if(item) {
      res.json(item);
    }
    else {
      res.status(404).end();
    }
  }
});

// POST Requests
router.post('/', function(req, res) {
  newItem = new Item({
    vendorName:	req.body.vendorName,
    prodName:   req.body.prodName,
    prodDesc:   req.body.prodDesc,
    SKU:   		req.body.SKU,
    category:   req.body.category,
    price:      req.body.price,
	numRatings: req.body.numRatings,
	avgRating: 	req.body.avgRating
  });

  if (req.body.hasOwnProperty('_id')) {
      item._id = mongoose.Types.ObjectId.createFromHexString(String(req.body._id));
  }
  Item.findOne({ SKU: req.body.SKU }).exec(response);
  function response(err, item) {
    if(item) {
      res.status(409).end();
    }
    else {
      newItem.save(function(err, newItem) {
        if(err) {
          res.status(400).end();
        }
        else {
          res.json(newItem);
        }
      });
    }
  }
});

// PUT Requests
router.put('/:SKU', function(req, res) {
  Item.findOne({ SKU: req.body.SKU }).exec(checkresponse);
  function checkresponse(err, item) {
    if(item) {
      res.status(409).end();
    }
  }
  
  var id = req.param('id');

  Item.findOne({ SKU: SKU }).exec(response);

  function response(err, item) {
    if(item) {
      item.vendorName   = (req.body.vendorName || item.vendorName)
      item.prodName     = (req.body.prodName || item.prodName)
      item.prodDesc     = (req.body.prodDesc || item.prodDesc)
	  item.SKU     		= (req.body.SKU || item.SKU)
      item.category     = (req.body.category || item.category)
      item.price        = (req.body.price || item.price)
	  item.numRatings	= (req.body.numRatings || item.numRatings)
	  item.avgRating	= (req.body.avgRating || item.avgRating)

      item.save(function (err) {
        if(err) {
          res.status(500).end();
        } 
        else {
          res.status(200).end();
        }
      });
    }
    else {
      res.status(404).end();
    }
  }
});

// DELETE Requests

router.delete('/:SKU', function(req, res) {
  var SKU = req.param('SKU');

  Item.findOne({ SKU: SKU }).exec(response);

  function response(err, item) {
    if(item) {
      item.remove(function (err) {
        if(err) {
          res.status(500).end();
        } 
        else {
          res.status(200).end();
        }
      });
    }
    else {
      res.status(404).end();
    }
  }
});

module.exports = router;

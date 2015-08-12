var mongoose = require('mongoose')
var express = require('express');
var router = express.Router();
var Review = require('../../models/review');

// GET Requests
router.get('/', function(req, res) {
  var filter = req.query;

  Review.find(filter).exec(response);

  function response(err, Reviews) {
    res.json(Reviews);
  }
});

router.get('/:id', function(req, res) {
  var id = req.param('id');

  Review.findById(id).exec(response);

  function response(err, Review) {
    if(Review) {
      res.json(Review);
    }
    else {
      res.status(404).end();
    }
  }
});

// POST Requests
router.post('/', function(req, res) {
  Review = new Review({
    itemId:				req.body.itemId,
    memberId:   		req.body.memberId,
    rating:   			req.body.rating,
	comment:   			req.body.comment,
    helpfulCount:   	req.body.helpfulCount,
    notHelpfulCount:	req.body.notHelpfulCount,
  });

  if (req.body.hasOwnProperty('_id')) {
      Review._id = mongoose.Types.ObjectId.createFromHexString(String(req.body._id));
  }

  Review.save(function(err, Review) {
    if(err) {
      res.status(400).end();
    }
    else {
      res.json(Review);
    }
  });
});

// PUT Requests
router.put('/:id', function(req, res) {
  var id = req.param('id');

  Review.findById(id).exec(response);

  function response(err, Review) {
    if(Review) {
      Review.itemId   			= (req.body.itemId || Review.itemId)
      Review.memberId     		= (req.body.memberId || Review.memberId)
      Review.rating     		= (req.body.rating || Review.rating)
	  Review.comment     		= (req.body.comment || Review.comment)
	  Review.helpfulCount   	= (req.body.helpfulCount || Review.helpfulCount)
      Review.notHelpfulCount	= (req.body.notHelpfulCount || Review.notHelpfulCount)

      Review.save(function (err) {
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

router.delete('/:id', function(req, res) {
  var id = req.param('id');

  Review.findById(id).exec(response);

  function response(err, Review) {
    if(Review) {
      Review.remove(function (err) {
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

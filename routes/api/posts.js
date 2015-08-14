var mongoose = require('mongoose')
var express = require('express');
var router = express.Router();
var Post = require('../../models/post');

// GET Requests
router.get('/', function(req, res) {
  var filter = req.query;

  Post.find(filter).exec(response);

  function response(err, Reviews) {
    res.json(Reviews);
  }
});

router.get('/:id', function(req, res) {
  var id = req.param('id');

  Post.findById(id).exec(response);

  function response(err, Post) {
    if(Post) {
      res.json(Post);
    }
    else {
      res.status(404).end();
    }
  }
});

// POST Requests
router.post('/', function(req, res) {
  newPost = new Post({
	subject:            req.body.subject,
	body:            	req.body.body,
	tags:             	req.body.tags,
	author:				req.body.author,
	hidden:				req.body.hidden,
	comments:			[]
  });

  if (req.body.hasOwnProperty('_id')) {
      Post._id = mongoose.Types.ObjectId.createFromHexString(String(req.body._id));
  }

  newPost.save(function(err, newPost) {
	if(err) {
	  res.status(400).end();
	}
	else {
	  res.json(newPost);
	}
  });
	
  
});

// PUT Requests
router.put('/:id', function(req, res) {
  var id = req.param('id');

  Post.findById(id).exec(response);

  function response(err, Post) {
    if(Post) {
      Post.subject   		= (req.body.subject || Post.subject)
      Post.body     		= (req.body.body || Post.body)
      Post.tags     		= (req.body.tags || Post.tags)
	  Post.author     		= (req.body.author || Post.author)
	  Post.hidden   		= (req.body.hidden || Post.hidden)
	  Post.modified			= Date.now()
	  Post.comments 		= (req.body.comments || Post.comments)

      Post.save(function (err) {
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

  Post.findById(id).exec(response);

  function response(err, Post) {
    if(Post) {
      Post.remove(function (err) {
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

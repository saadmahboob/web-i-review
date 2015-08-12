var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Member = require('../../models/member');

router.get('/', function(req, res) {
  var filter = req.query;

  Member.find(filter).exec(response);

  function response(err, members) {
    res.json(members);
  }
});

router.get('/:email', function(req, res) {
  var email = req.param('email');

  Member.findOne({ email: email }).exec(response);

  function response(err, member) {
    if(member) {
      res.json(member);
    }
    else {
      res.status(404).end();
    }
  }
});

router.post('/', function(req, res) {
  var email = req.body.email;

  newMember = new Member({
    email:                email,
    firstName:            req.body.firstName,
    lastName:             req.body.lastName,
    mobileNumber:         req.body.mobileNumber,
    hashedPassword:       req.body.hashedPassword
  });

  if (req.body.hasOwnProperty('_id')) {
      newMember._id = mongoose.Types.ObjectId.createFromHexString(String(req.body._id));
  }

  Member.findOne({ email: email }).exec(response);

  function response(err, member) {
    if(member) {
      res.status(409).end();
    }
    else {
      newMember.save(function(err, newMember) {
        if(err) {
          res.status(400).end();
        }
        else {
          res.json(newMember);
        }
      });
    }
  }
});

router.put('/:email', function(req, res) {
  Member.findOne({ email: req.body.email }).exec(checkresponse);
  function checkresponse(err, member) {
    if(member) {
      res.status(409).end();
    }
  }
  
  var email = req.param('email');

  Member.findOne({ email: email }).exec(response);

  function response(err, member) {
    if(member) {
      member.email               = (req.body.email || member.email),
      member.firstName           = (req.body.firstName || member.firstName),
      member.lastName            = (req.body.lastName || member.lastName),
      member.mobileNumber        = (req.body.mobileNumber || member.mobileNumber),
      member.hashedPassword      = (req.body.hashedPassword || member.hashedPassword),

      member.save(function (err) {
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

router.delete('/:email', function(req, res) {
  var email = req.param('email');

  Member.findOne({ email: email }).exec(response);

  function response(err, member) {
    if(member) {
      member.remove(function (err) {
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

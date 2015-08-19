var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Member = require('../../models/member');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

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
    if(req.body.email && member) {
      res.status(409).end();
    }
	else {
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

router.localAuthenticate = function(username, password, done) {
	console.log(username+"//"+password+" is trying to login as local.");
	Member.findOne( {email: username} ).exec(response);
	function response(err, member){
		if(err) {
			console.log(err.stack);
			return done(null, false, { message: 'Internal Server Error' });
		}
		else if(!member){
			console.log("member not found.");
			return done(null, false, { message: 'Unknown user ' + username });
		}
		else {
			bcrypt.compare(password, member.hashedPassword, function(err, res) {
				if (res == false) {
					console.log("Password does not match");
					return done(null, false, { message: 'Incorrect password' });
				}
				else {
					return done(null, member);
				}
			});
		}
	}
}

router.localRegistration = function(req, username, password, done) {
	console.log(username+"//"+password+" is trying to register as local.");
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) {
			console.log(err.stack);
			return done(null, false, { message: 'bcrypt salt failure' });
		}
		else {
			bcrypt.hash(password, salt, function(err, hash) {
				if(err) {
					console.log(err.stack);
					return done(null, false, { message: 'bcrypt hash failure' });
				}
				else {
					newMember = new Member({
						email:                username,
						firstName:            req.body.firstName,
						lastName:             req.body.lastName,
						hashedPassword:       hash
					});
					Member.findOne({ email: username }).exec(response);
					function response(err, member) {
						if (err) {
							console.log(err.stack);
							return done(null, false, { message: 'Internal server error has occured' });
						}
						else if(member) {
							return done(null, false, { message: username + ' is already registered' });
						}
						else {
							newMember.save(function(err, newMember) {
								if(err) {
									return done(null, false, { message: 'Internal error has occured' });
								}
								else {
									return done(null, newMember);
								}
							});
						}
					}
				}
			});
		}
	});
}

router.serializeUser = function(user, done) {
	console.log("serializing " + user.email);
	done(null, user);
}

router.deserializeUser = function(obj, done) {
	console.log("deserializing " + obj.email);
	done(null, obj);
}

module.exports = router;

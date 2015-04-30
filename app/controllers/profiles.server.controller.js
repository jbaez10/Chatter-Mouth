'use strict';
var path = require('path');
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Profile = mongoose.model('Profile'),
	_ = require('lodash');

/**
 * Create a Profile
 */
exports.create = function(req, res) {
  var profile = new Profile(req.body);
  profile.user = req.user;
  profile.likes.push(req.user._id);
  if(req.files.file) {
    profile.image =req.files.file.path.substring(req.files.file.path.indexOf(path.sep)+path.sep.length-1);
  }  else
    profile.image='default.jpg';
  profile.save(function(err) {
    if (err) {
      console.log('detected error:',errorHandler.getErrorMessage(err));
      return res.status(400).send({
	message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({_id:profile._id});
    }
  });
};

/**
 * Show the current Profile
 */
exports.read = function(req, res) {
  var profile = req.profile;
  //  profile = _.extend(profile , req.body);
  profile.views += 1;
  profile.save(function(err) {
    if (err) {
      console.log('Problem'+err);
      return res.status(400).send({
	message: errorHandler.getErrorMessage(err)
      });
    } else
      console.log(profile);
      res.jsonp(profile);
  });
};


/**
 * Update a Profile
 */
exports.update = function(req, res) {
	var profile = req.profile ;

	profile = _.extend(profile , req.body);

	profile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profile);
		}
	});
};

/**
 * Delete an Profile
 */
exports.delete = function(req, res) {
	var profile = req.profile ;

	profile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profile);
		}
	});
};

/**
 * List of Profiles
 */
exports.list = function(req, res) { 
	Profile.find().sort('-created').populate('user', 'displayName').exec(function(err, profiles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(profiles);
		}
	});
};
/**
 * Likes a profile
 */
exports.like = function(req, res) {
  var user = req.user;
  var containsValue = false;

  // Determine if user is already in 
  for(var i=0; i<req.profile.likes.length; i++) {
    console.log('Comparing ' + req.profile.likes[i] + ' to ' + req.user._id + ' is ' + req.profile.likes[i].equals(req.user._id));
    if(req.profile.likes[i].equals(req.user._id)) {
      containsValue = true;
    }
  }
  if(!containsValue) {
	req.profile.likes.push(req.user._id);
  }
  req.profile.save(function(err) {
    if (err) {
      return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(req.profile);
	 }
  });
};

/**
 * Profile middleware
 */
exports.profileByID = function(req, res, next, id) {
  console.log('finding by id:'+id);
	Profile.findById(id).populate('user', 'displayName').exec(function(err, profile) {
	  if (err) return next(err);
	  if (! profile) return next(new Error('Failed to load Profile ' + id));
	  req.profile = profile;
	  next();
	});
};

/**
 * Profile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.profile.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

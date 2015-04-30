'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users.server.controller');
  var profiles = require('../../app/controllers/profiles.server.controller');
  var multer = require('multer');
  
  app.use(multer({ dest:'./public/uploads'}));
  // Profiles Routes
  app.route('/profiles')
		.get(profiles.list)
		.post(users.requiresLogin, profiles.create);

	app.route('/profiles/:profileId')
		.get(profiles.read)
		.put(users.requiresLogin, profiles.hasAuthorization, profiles.update)
		.delete(users.requiresLogin, profiles.hasAuthorization, profiles.delete);
	//adds a route for likes
	app.route('/profiles/like/:profileId')
        .put(users.requiresLogin, profiles.like);
  
	// Finish by binding the Profile middleware
	app.param('profileId', profiles.profileByID);
	
};

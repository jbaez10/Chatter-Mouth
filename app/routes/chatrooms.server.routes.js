'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	chatrooms = require('../../app/controllers/chatrooms.server.controller');

module.exports = function(app) {
	// Chatroom Routes
	app.route('/chatrooms')
		.get(chatrooms.list)
		.post(users.requiresLogin, chatrooms.create);

	app.route('/chatrooms/:chatroomId')
		.get(chatrooms.read)
		.put(users.requiresLogin, chatrooms.hasAuthorization, chatrooms.update)
		.delete(users.requiresLogin, chatrooms.hasAuthorization, chatrooms.delete);

	// Finish by binding the chatroom middleware
	app.param('chatroomId', chatrooms.chatroomByID);
};
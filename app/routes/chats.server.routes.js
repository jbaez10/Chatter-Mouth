'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	chats = require('../../app/controllers/chats.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/chats')
		.get(chats.list)
		.post(users.requiresLogin, chats.create);

	app.route('/chats/:chatId')
		.get(chats.read)
		.put(users.requiresLogin, chats.hasAuthorization, chats.update)
		.delete(users.requiresLogin, chats.hasAuthorization, chats.delete);

	// Finish by binding the article middleware
	app.param('chatId', chats.chatByID);
};
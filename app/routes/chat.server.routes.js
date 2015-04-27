'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/chat.server.controller');

module.exports = function(app) {
	
	// Chat Routes
	app.route('/chat')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);

	app.route('/chat/:chatId')
		.get(chat.read)
		.put(users.requiresLogin, chat.hasAuthorization, chat.update)
		.delete(users.requiresLogin, chat.hasAuthorization, chat.delete);

	// Finish by binding the article middleware
	app.param('chatId', articles.chatByID);
};
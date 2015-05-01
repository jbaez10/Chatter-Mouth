'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Chat = mongoose.model('Chat'),
	_ = require('lodash');

/**
 * Create a chat
 */
exports.create = function(req, res) {
	var chat = new Chat(req.body);
	chat.user = req.user;

	chat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio'); // makes a socket instance
			socketio.emit('chat.created', chat); // sends the socket event to all current users

                  res.json(chat);
		}
	});
};

/**
 * Show the current chat
 */
exports.read = function(req, res) {
	res.json(req.chat);
};

/**
 * Update a chat
 */
exports.update = function(req, res) {
	var chat = req.chat;

	chat = _.extend(chat, req.body);

	chat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(chat);
		}
	});
};

/**
 * Delete a chat
 */
exports.delete = function(req, res) {
	var chat = req.chat;

	chat.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(chat);
		}
	});
};

/**
 * List of chats
 */
exports.list = function(req, res) {
	Chat.find().sort('-created').populate('user', 'displayName').exec(function(err, chats) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(chats);
		}
	});
};

/**
 * Chat middleware
 */
exports.chatByID = function(req, res, next, id) {
	Chat.findById(id).populate('user', 'displayName').exec(function(err, chat) {
		if (err) return next(err);
		if (!chat) return next(new Error('Failed to load chat ' + id));
		req.chat = chat;
		next();
	});
};

/**
 * Chat authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.chat.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
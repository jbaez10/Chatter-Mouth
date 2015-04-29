'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Chatroom = mongoose.model('Chatroom'),
	_ = require('lodash');

/**
 * Create a chatroom
 */
exports.create = function(req, res) {
	var chatroom = new Chatroom(req.body);
	chatroom.user = req.user;

	chatroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio'); // makes a socket instance
			socketio.emit('chatroom.created', chatroom); // sends the socket event to all current users

                  res.json(chatroom);
		}
	});
};

/**
 * Show the current chatroom
 */
exports.read = function(req, res) {
	res.json(req.chatroom);
};

/**
 * Update a chatroom
 */
exports.update = function(req, res) {
	var chatroom = req.chatroom;

	chatroom = _.extend(chatroom, req.body);

	chatroom.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(chatroom);
		}
	});
};

/**
 * Delete an chatroom
 */
exports.delete = function(req, res) {
	var chatroom = req.chatroom;

	chatroom.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(chatroom);
		}
	});
};

/**
 * List of Chatrooms
 */
exports.list = function(req, res) {
	Chatroom.find().sort('-created').populate('user', 'displayName').exec(function(err, chatrooms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(chatrooms);
		}
	});
};

/**
 * Chatroom middleware
 */
exports.chatroomByID = function(req, res, next, id) {
	Chatroom.findById(id).populate('user', 'displayName').exec(function(err, chatroom) {
		if (err) return next(err);
		if (!chatroom) return next(new Error('Failed to load chatroom ' + id));
		req.chatroom = chatroom;
		next();
	});
};

/**
 * Chatroom authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.chatroom.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
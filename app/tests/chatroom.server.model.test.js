'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Chatroom = mongoose.model('Chatroom');

/**
 * Globals
 */
var user, chatroom;

/**
 * Unit tests
 */
describe('Chatroom Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			chatroom = new Chatroom({
				title: 'Chatroom Title',
				content: 'Chatroom Content',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return chatroom.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			chatroom.title = '';

			return chatroom.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Chatroom.remove().exec();
		User.remove().exec();
		done();
	});
});
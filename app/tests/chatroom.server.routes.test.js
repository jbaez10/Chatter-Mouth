'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Chatroom = mongoose.model('Chatroom'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, chatroom;

/**
 * Chatroom routes tests
 */
describe('Chatroom CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new chatroom
		user.save(function() {
			chatroom = {
				title: 'Chatroom Title',
				content: 'Chatroom Content'
			};

			done();
		});
	});

	it('should be able to save an chatroom if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new chatroom
				agent.post('/chatrooms')
					.send(chatroom)
					.expect(200)
					.end(function(chatroomSaveErr, chatroomSaveRes) {
						// Handle chatroom save error
						if (chatroomSaveErr) done(chatroomSaveErr);

						// Get a list of chatrooms
						agent.get('/chatrooms')
							.end(function(chatroomsGetErr, chatroomsGetRes) {
								// Handle chatroom save error
								if (chatroomsGetErr) done(chatroomsGetErr);

								// Get chatrooms list
								var chatrooms = chatroomsGetRes.body;

								// Set assertions
								(chatrooms[0].user._id).should.equal(userId);
								(chatrooms[0].title).should.match('Chatroom Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an chatroom if not logged in', function(done) {
		agent.post('/chatrooms')
			.send(chatroom)
			.expect(401)
			.end(function(chatroomSaveErr, chatroomSaveRes) {
				// Call the assertion callback
				done(chatroomSaveErr);
			});
	});

	it('should not be able to save an chatroom if no title is provided', function(done) {
		// Invalidate title field
		chatroom.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new chatroom
				agent.post('/chatrooms')
					.send(chatroom)
					.expect(400)
					.end(function(chatroomSaveErr, chatroomSaveRes) {
						// Set message assertion
						(chatroomSaveRes.body.message).should.match('Title cannot be blank');
						
						// Handle chatroom save error
						done(chatroomSaveErr);
					});
			});
	});

	it('should be able to update an chatroom if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new chatroom
				agent.post('/chatrooms')
					.send(chatroom)
					.expect(200)
					.end(function(chatroomSaveErr, chatroomSaveRes) {
						// Handle chatroom save error
						if (chatroomSaveErr) done(chatroomSaveErr);

						// Update chatroom title
						chatroom.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing chatroom
						agent.put('/chatrooms/' + chatroomSaveRes.body._id)
							.send(chatroom)
							.expect(200)
							.end(function(chatroomUpdateErr, chatroomUpdateRes) {
								// Handle chatroom update error
								if (chatroomUpdateErr) done(chatroomUpdateErr);

								// Set assertions
								(chatroomUpdateRes.body._id).should.equal(chatroomSaveRes.body._id);
								(chatroomUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of chatrooms if not signed in', function(done) {
		// Create new chatroom model instance
		var chatroomObj = new Chatroom(chatroom);

		// Save the chatroom
		chatroomObj.save(function() {
			// Request chatrooms
			request(app).get('/chatrooms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single chatroom if not signed in', function(done) {
		// Create new chatroom model instance
		var chatroomObj = new Chatroom(chatroom);

		// Save the chatroom
		chatroomObj.save(function() {
			request(app).get('/chatrooms/' + chatroomObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', chatroom.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an chatroom if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new chatroom
				agent.post('/chatrooms')
					.send(chatroom)
					.expect(200)
					.end(function(chatroomSaveErr, chatroomSaveRes) {
						// Handle chatroom save error
						if (chatroomSaveErr) done(chatroomSaveErr);

						// Delete an existing chatroom
						agent.delete('/chatrooms/' + chatroomSaveRes.body._id)
							.send(chatroom)
							.expect(200)
							.end(function(chatroomDeleteErr, chatroomDeleteRes) {
								// Handle chatroom error error
								if (chatroomDeleteErr) done(chatroomDeleteErr);

								// Set assertions
								(chatroomDeleteRes.body._id).should.equal(chatroomSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an chatroom if not signed in', function(done) {
		// Set chatroom user 
		chatroom.user = user;

		// Create new chatroom model instance
		var chatroomObj = new Chatroom(chatroom);

		// Save the chatroom
		chatroomObj.save(function() {
			// Try deleting chatroom
			request(app).delete('/chatrooms/' + chatroomObj._id)
			.expect(401)
			.end(function(chatroomDeleteErr, chatroomDeleteRes) {
				// Set message assertion
				(chatroomDeleteRes.body.message).should.match('User is not logged in');

				// Handle chatroom error error
				done(chatroomDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Chatroom.remove().exec();
		done();
	});
});
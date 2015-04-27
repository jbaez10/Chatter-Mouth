'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Chat = mongoose.model('Chat'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, article;

/**
 * Article routes tests
 */
describe('Chat CRUD tests', function() {
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

		// Save a user to the test db and create new article
		user.save(function() {
			chat = {
				title: 'Chat Title',
				content: 'Chat Content'
			};

			done();
		});
	});

	it('should be able to save an article if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new article
				agent.post('/chat')
					.send(chat)
					.expect(200)
					.end(function(chatSaveErr, chatSaveRes) {
						// Handle article save error
						if (chatSaveErr) done(chatSaveErr);

						// Get a list of articles
						agent.get('/chat')
							.end(function(chatGetErr, chatGetRes) {
								// Handle article save error
								if (chatGetErr) done(chatGetErr);

								// Get articles list
								var chat = chatGetRes.body;

								// Set assertions
								(chat[0].user._id).should.equal(userId);
								(chat[0].title).should.match('Chat Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an chat if not logged in', function(done) {
		agent.post('/chat')
			.send(chat)
			.expect(401)
			.end(function(chatSaveErr, chatSaveRes) {
				// Call the assertion callback
				done(chatSaveErr);
			});
	});

	it('should not be able to save an chat if no title is provided', function(done) {
		// Invalidate title field
		chat.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new article
				agent.post('/chat')
					.send(chat)
					.expect(400)
					.end(function(chatSaveErr, chatSaveRes) {
						// Set message assertion
						(chatSaveRes.body.message).should.match('Title cannot be blank');
						
						// Handle article save error
						done(chatSaveErr);
					});
			});
	});

	it('should be able to update an chatif signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new article
				agent.post('/chat')
					.send(chat)
					.expect(200)
					.end(function(chatSaveErr, chatSaveRes) {
						// Handle article save error
						if (chatSaveErr) done(chatSaveErr);

						// Update article title
						chat.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing article
						agent.put('/chat/' + chatSaveRes.body._id)
							.send(chat)
							.expect(200)
							.end(function(chatUpdateErr, chatUpdateRes) {
								// Handle article update error
								if (chatUpdateErr) done(chatUpdateErr);

								// Set assertions
								(chatUpdateRes.body._id).should.equal(chatSaveRes.body._id);
								(chatUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of articles if not signed in', function(done) {
		// Create new article model instance
		var chatObj = new Chat(chat);

		// Save the article
		chatObj.save(function() {
			// Request articles
			request(app).get('/chat')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single chat if not signed in', function(done) {
		// Create new article model instance
		var chatObj = new Chat(chat);

		// Save the article
		chatObj.save(function() {
			request(app).get('/chat/' + chatObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', chat.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an chat if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new article
				agent.post('/chat')
					.send(chat)
					.expect(200)
					.end(function(chatSaveErr, chatSaveRes) {
						// Handle chat save error
						if (chatSaveErr) done(chatSaveErr);

						// Delete an existing chat
						agent.delete('/chat/' + chatSaveRes.body._id)
							.send(chat)
							.expect(200)
							.end(function(chatDeleteErr, chatDeleteRes) {
								// Handle chat error error
								if (chatDeleteErr) done(chatDeleteErr);

								// Set assertions
								(chatDeleteRes.body._id).should.equal(chatSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an chat if not signed in', function(done) {
		// Set article user 
		chat.user = user;

		// Create new chat model instance
		var chatObj = new Chat(chat);

		// Save the chat
		chatObj.save(function() {
			// Try deleting chat
			request(app).delete('/chat/' + articleObj._id)
			.expect(401)
			.end(function(chatDeleteErr, chatDeleteRes) {
				// Set message assertion
				(chatDeleteRes.body.message).should.match('User is not logged in');

				// Handle article error error
				done(chatDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Chat.remove().exec();
		done();
	});
});
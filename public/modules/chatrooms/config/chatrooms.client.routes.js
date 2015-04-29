'use strict';

// Setting up route
angular.module('chatrooms').config(['$stateProvider',
	function($stateProvider) {
		// Chatrooms state routing
		$stateProvider.
		state('listChatrooms', {
			url: '/chatrooms',
			templateUrl: 'modules/chatrooms/views/list-chatrooms.client.view.html'
		}).
		state('createChatroom', {
			url: '/chatrooms/create',
			templateUrl: 'modules/chatrooms/views/create-chatroom.client.view.html'
		}).
		state('viewChatroom', {
			url: '/chatrooms/:chatroomId',
			templateUrl: 'modules/chatrooms/views/view-chatroom.client.view.html'
		}).
		state('editChatroom', {
			url: '/chatrooms/:chatroomId/edit',
			templateUrl: 'modules/chatrooms/views/edit-chatroom.client.view.html'
		});
	}
]);
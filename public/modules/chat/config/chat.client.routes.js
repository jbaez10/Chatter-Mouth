'use strict';

// Setting up route
angular.module('chat').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listChat', {
			url: '/chat',
			templateUrl: 'modules/chat/views/list-chat.client.view.html'
		}).
		state('createChat', {
			url: '/chat/create',
			templateUrl: 'modules/articles/views/create-chat.client.view.html'
		}).
		state('viewChta', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-chat.client.view.html'
		}).
		state('editChat', {
			url: '/chat/:chatId/edit',
			templateUrl: 'modules/chat/views/edit-chat.client.view.html'
		});
	}
]);
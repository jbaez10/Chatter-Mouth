'use strict';

//Chatrooms service used for communicating with the chatrooms REST endpoints
angular.module('chatrooms').factory('Chatrooms', ['$resource',
	function($resource) {
		return $resource('chatrooms/:chatroomId', {
			chatroomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
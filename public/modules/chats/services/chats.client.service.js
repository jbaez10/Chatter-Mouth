'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('chats').factory('Chats', ['$resource',
	function($resource) {
		return $resource('chats/:chatId', {
			chatId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
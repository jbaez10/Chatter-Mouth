'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('chat').factory('Chat', ['$resource',
	function($resource) {
		return $resource('chat/:chatId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
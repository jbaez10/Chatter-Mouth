'use strict';
//add socket to dependencies
angular.module('chat').controller('ChatController', ['$scope', '$stateParams', '$location', 'Authentication', 'Socket', 'Chat',
	//add socket to parameters
	function($scope, $stateParams, $location, Authentication, Socket, Chat) {
		$scope.authentication = Authentication;
		$scope.create = function() {
			var chat = new Chat({
				title: this.title,
				content: this.content
			});
			chat.$save(function(response) {
				$location.path('chat/' + response._id);
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(chat) {
			if (chat) {
				chat.$remove();

				for (var i in $scope.chat) {
					if ($scope.chat[i] === chat) {
						$scope.chat.splice(i, 1);
					}
				}
			} else {
				$scope.chat.$remove(function() {
					$location.path('chat');
				});
			}
		};

		$scope.update = function() {
			var chat = $scope.chat;

			chat.$update(function() {
				$location.path('chat/' + chat._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.chat = Chat.query();
		};

		$scope.findOne = function() {
			$scope.chat = Chat.get({
				chatId: $stateParams.chatId
			});
		};
	}
]);
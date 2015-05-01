'use strict';
//add socket to dependencies
angular.module('chats').controller('ChatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Socket', 'Chats',
	//add socket to parameters
	function($scope, $stateParams, $location, Authentication, Socket, Chats) {
		$scope.authentication = Authentication;
		$scope.chats = Chats.query();
		
		$scope.create = function() {
			var chat = new Chats({
				title: this.title,
				content: this.content
			});
			chat.$save(function(response) {
				$location.path('chatrooms/' + chatroom._id);
				$scope.chats = Chats.query();
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(chat) {
			if (chat) {
				chat.$remove();

				for (var i in $scope.chats) {
					if ($scope.chats[i] === chat) {
						$scope.chats.splice(i, 1);
					}
				}
			} else {
				$scope.chat.$remove(function() {
					$location.path('chats');
				});
			}
		};

		$scope.update = function() {
			var chat = $scope.chat;

			chat.$update(function() {
				$location.path('chats/' + chat._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.chats = Chats.query();
		};

		$scope.findOne = function() {
			$scope.chat = Chats.get({
				chatId: $stateParams.chatId
			});
		};
	}
]);
'use strict';
//add socket to dependencies
angular.module('chatrooms').controller('ChatroomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Socket', 'Chatrooms',
	//add socket to parameters
	function($scope, $stateParams, $location, Authentication, Socket, Chatrooms) {
		$scope.authentication = Authentication;
		$scope.create = function() {
			var chatroom = new Chatrooms({
				title: this.title,
				content: this.content
			});
			chatroom.$save(function(response) {
				$location.path('chatrooms/' + response._id);
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(chatroom) {
			if (chatroom) {
				chatroom.$remove();

				for (var i in $scope.chatrooms) {
					if ($scope.chatrooms[i] === chatroom) {
						$scope.chatrooms.splice(i, 1);
					}
				}
			} else {
				$scope.chatroom.$remove(function() {
					$location.path('chatrooms');
				});
			}
		};

		$scope.update = function() {
			var chatroom = $scope.chatroom;

			chatroom.$update(function() {
				$location.path('chatrooms/' + chatroom._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.chatrooms = Chatrooms.query();
		};

		$scope.findOne = function() {
			$scope.chatroom = Chatrooms.get({
				chatroomId: $stateParams.chatroomId
			});
		};
	}
]);
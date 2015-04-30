'use strict';

//note addition of $http
angular.module('profiles')
.controller('ProfilesController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Profiles',  
	function($scope, $stateParams, $location, $http, Authentication, Profiles) {
	  $scope.authentication = Authentication;

	  $scope.likes = 0;
	  $scope.isLiked = false;
		// Create new Profile

	  $scope.create = function() {
	    // Create new Profile object
	    var profile = new Profiles ({
	      name: $scope.imageName,
              file: $scope.imageFile
	    });
	    profile.$save(function(response) {
	      $location.path('profiles/' + response._id);
	      // Clear form fields
	      $scope.imageName = '';
              $scope.imageFile = '';

	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
            
	  };
	  //Swipe to remove profile from display
	  $scope.hide = function($index) {
		$scope.profiles.splice($index,1);
	  };
	  // Remove existing Profile
	  $scope.remove = function(profile) {
	    if ( profile ) { 
	      profile.$remove();
              
	      for (var i in $scope.profiles) {
		if ($scope.profiles [i] === profile) {
		  $scope.profiles.splice(i, 1);
		}
	      }
	    } else {
	      $scope.profile.$remove(function() {
		$location.path('profiles');
	      });
	    }
	  };

	  // Update existing Profile
	  $scope.update = function() {
	    var profile = $scope.profile;

	    profile.$update(function() {
	      $location.path('profiles/' + profile._id);
	    }, function(errorResponse) {
		 $scope.error = errorResponse.data.message;
	       });
	  };

	  // Find a list of Profiles
	  $scope.find = function() {
	    $scope.profiles = Profiles.query();
	  };

	  // Find existing Profile
	  $scope.findOne = function() {
	    $scope.profile = Profiles.get({ 
	      profileId: $stateParams.profileId
	    },function(){
                var user = $scope.authentication.user;
                var containsValue=false;
                if($scope.authentication.user) {
					console.log('ID '+$scope.authentication.user._id);
					$scope.likes = $scope.profile.likes.length;
					for(var i=0; i<$scope.profile.likes.length; i++) {
						console.log('Comparing ' + $scope.profile.likes[i] + ' to ' + user._id + ' is ' + ($scope.profile.likes[i]===user._id).toString());
						if($scope.profile.likes[i]===user._id) {
							containsValue = true;
						}
					}
				}
                $scope.isLiked = containsValue;
              },function(){console.log('error');});

	  };
          
	  //Like a profile
	  $scope.likeThis = function() {
	    var profile = $scope.profile;
	    $http.put('profiles/like/' + profile._id).success(function() {
              // Update the profile with our user ID.
              profile.likes.push($scope.authentication.user._id);
              
              $scope.isLiked=true;
	    });

         };   
        }])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

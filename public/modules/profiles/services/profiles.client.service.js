'use strict';
// transform the profile (passed in as data) using a fd to submit it using mulitpart.
function transformProfile(data) {
    if (data === undefined)
      return data;
  console.log('transforming data',data);
    var fd = new FormData();
  fd.append('file', data.file);
  fd.append('name', data.name);
  return fd;
}

angular.module('profiles').factory('Profiles', ['$resource',
	function($resource) {
		return $resource('profiles/:profileId', { profileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			save: {
			  method: 'POST',
                          transformRequest: transformProfile,
                          headers: {'Content-Type': undefined}
			}
		});
	}
]);

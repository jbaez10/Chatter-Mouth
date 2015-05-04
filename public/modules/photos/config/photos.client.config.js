'use strict';

// Configuring the Articles module
angular.module('photos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Photos', 'photos', 'dropdown', '/photos(/create)?', false);
		Menus.addSubMenuItem('topbar', 'photos', 'My Photos', 'photos/myphotos', false);
		Menus.addSubMenuItem('topbar', 'photos', 'All Photos', 'photos', false);
		Menus.addSubMenuItem('topbar', 'photos', 'Upload A New Photo', 'photos/create', false);
	}
]);

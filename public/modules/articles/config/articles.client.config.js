'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', "Status Menu", 'articles', 'dropdown', '/status(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', "Previous Status'", 'status');
		Menus.addSubMenuItem('topbar', 'articles', "Create New Status", 'status/create');
	}
]);
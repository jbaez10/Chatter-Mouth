'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', "Status'", 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', "Previous Status'", 'articles');
		Menus.addSubMenuItem('topbar', 'articles', "Create New Status'", 'articles/create');
	}
]);
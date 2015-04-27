'use strict';

// Configuring the Articles module
angular.module('profilepic').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'pp', 'pp', 'dropdown', '/pp(/create)?', false);
		Menus.addSubMenuItem('topbar', 'pp', 'List Photos', 'pp', false);
		Menus.addSubMenuItem('topbar', 'pp', 'New Photo', 'pp/create', false);
	}
]);

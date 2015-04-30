'use strict';

// Configuring the Articles module
angular.module('profiles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Profile Pic', 'profiles', 'dropdown', '/profiles(/create)?', false);
		Menus.addSubMenuItem('topbar', 'profiles', 'Current Profile Pic', 'profiles', false);
		Menus.addSubMenuItem('topbar', 'profiles', 'Upload New Profile Pic', 'profiles/create', false);
	}
]);

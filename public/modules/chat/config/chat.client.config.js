'use strict';

// Configuring the Articles module
angular.module('chat').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', "Status'", 'chat', 'dropdown', '/chat(/create)?');
		Menus.addSubMenuItem('topbar', 'chat', "Previous Chat'", 'chat');
		Menus.addSubMenuItem('topbar', 'chat', "Create New Chat'", 'chat/create');
	}
]);
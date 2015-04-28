'use strict';

// Configuring the Articles module
angular.module('chats').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', "Chats'", 'chats', 'dropdown', '/chats(/create)?');
		Menus.addSubMenuItem('topbar', 'chats', "Chat'", 'chats');
		Menus.addSubMenuItem('topbar', 'chats', "Create New Chat'", 'chats/create');
	}
]);
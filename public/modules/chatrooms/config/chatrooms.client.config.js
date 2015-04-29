'use strict';

// Configuring the Articles module
angular.module('chatrooms').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', "Chatrooms", 'chatrooms', 'dropdown', '/chatrooms(/create)?');
		Menus.addSubMenuItem('topbar', 'chatrooms', "List of Chatrooms'", 'chatrooms');
		Menus.addSubMenuItem('topbar', 'chatrooms', "Create New Chatroom'", 'chatrooms/create');
	}
]);
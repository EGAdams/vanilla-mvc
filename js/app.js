/*global app, $on */
(function () {
	'use strict';
	/**
	 * Sets up a brand new Todo list.
	 *
	 * @param {string} name The name of your new to do list.
	 */
	function Todo(name) {
		this.storage    = new app.Store( name );                        // connects directly to data source.
		this.model      = new app.Model( this.storage );				// talks to storage
		this.template   = new app.Template();							// holds skeleton that needs data
		this.view       = new app.View( this.template );                // manipulates the DOM
		this.controller = new app.Controller( this.model, this.view );  // 
	}

	let todo = new Todo('todos-vanillajs');

	function setView() { todo.controller.setView( document.location.hash );	}
	$on( window, 'load',       setView );
	$on( window, 'hashchange', setView );
})();

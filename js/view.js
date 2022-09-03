/*global qs, qsa, $on, $parent, $delegate */

( function ( window ) {
	'use strict';
	/**
	 * View that abstracts away the browser's DOM completely.
	 * It has two simple entry points:
	 *
	 *   - bind( eventName, handler )
	 *     Takes a todo application event and registers the handler
	 *   - render( command, parameterObject )
	 *     Renders the given command with the options
	 */
	function View ( template ) {
		this.template = template;
		this.ENTER_KEY = 13;
		this.ESCAPE_KEY = 27;
		this.$todoList = qs( '.todo-list' );
		this.$todoItemCounter = qs( '.todo-count' );
		this.$clearCompleted = qs( '.clear-completed' );
		this.$main = qs( '.main' );
		this.$footer = qs( '.footer' );
		this.$toggleAll = qs( '.toggle-all' );
		this.$newTodo = qs( '.new-todo' );
	}

	View.prototype._removeItem = function ( id ) {
		let elem = qs( '[data-id="' + id + '"]' );
		if ( elem ) { this.$todoList.removeChild( elem ); }
	};

	View.prototype._clearCompletedButton = function ( completedCount, visible ) {
		this.$clearCompleted.innerHTML = this.template.clearCompletedButton( completedCount );
		this.$clearCompleted.style.display = visible ? 'block' : 'none';
	};

	View.prototype._setFilter = function ( currentPage ) {
		qs( '.filters .selected' ).className = '';
		qs( '.filters [href="#/' + currentPage + '"]' ).className = 'selected';
	};

	View.prototype._elementComplete = function ( id, completed ) {
		let listItem = qs( '[data-id="' + id + '"]' );
		if ( !listItem ) { return; }
		listItem.className = completed ? 'completed' : '';
		qs( 'input', listItem ).checked = completed;
	};	// In case it was toggled from an event and not by clicking the checkbox

	View.prototype._editItem = function ( id, title ) {
		let listItem = qs( '[data-id="' + id + '"]' );
		if ( !listItem ) { return; }
		listItem.className = listItem.className + ' editing';
		let input = document.createElement( 'input' );
		input.className = 'edit';
		listItem.appendChild( input );
		input.focus();
		input.value = title;
	};

	View.prototype._editItemDone = function ( id, title ) {
		let listItem = qs( '[data-id="' + id + '"]' );
		if ( !listItem ) { return; }
		let input = qs( 'input.edit', listItem );
		listItem.removeChild( input );
		listItem.className = listItem.className.replace( 'editing', '' );
		qsa( 'label', listItem ).forEach( function ( label ) { label.textContent = title; } );
	};

	View.prototype.render = function ( viewCmd, parameter ) {
		let self = this;
		let viewCommands = {  // commands that may affect the DOM.  This is the only object that talks to the DOM.
			showEntries: function () { self.$todoList.innerHTML = self.template.show( parameter ); },
			removeItem: function () { self._removeItem( parameter ); },
			updateElementCount: function () { self.$todoItemCounter.innerHTML = self.template.itemCounter( parameter ); },
			clearCompletedButton: function () { self._clearCompletedButton( parameter.completed, parameter.visible ); },
			contentBlockVisibility: function () { self.$main.style.display = self.$footer.style.display = parameter.visible ? 'block' : 'none'; },
			toggleAll: function () { self.$toggleAll.checked = parameter.checked; },
			setFilter: function () { self._setFilter( parameter ); },
			clearNewTodo: function () { self.$newTodo.value = ''; },
			elementComplete: function () { self._elementComplete( parameter.id, parameter.completed ); },
			editItem: function () { self._editItem( parameter.id, parameter.title ); },
			editItemDone: function () { self._editItemDone( parameter.id, parameter.title ); }
		};
		viewCommands[ viewCmd ]();
	};

	View.prototype._itemId = function ( element ) {
		let li = $parent( element, 'li' );
		return parseInt( li.dataset.id, 10 );
	};

	View.prototype._bindItemEditDone = function ( handler ) {
		let self = this;
		$delegate( self.$todoList, 'li .edit', 'blur', function () {
			if ( !this.dataset.iscanceled ) { handler( { id: self._itemId( this ), title: this.value } ); }
		} );

		$delegate( self.$todoList, 'li .edit', 'keypress', function ( event ) { // Remove the cursor from the input when you hit enter
			if ( event.keyCode === self.ENTER_KEY ) { this.blur(); }
		} );
	};    // just like if it were a real form

	View.prototype._bindItemEditCancel = function ( handler ) {
		let self = this;
		$delegate( self.$todoList, 'li .edit', 'keyup', function ( event ) {
			if ( event.keyCode === self.ESCAPE_KEY ) {
				this.dataset.iscanceled = true;
				this.blur();
				handler({ id: self._itemId( this )}); }}); };

	View.prototype.bind = function ( event, handler ) {
		let self = this;
		if (        event === 'newTodo'         ) { $on(       self.$newTodo,        'change', function () { handler( self.$newTodo.value );       });
		} else if ( event === 'removeCompleted' ) { $on(       self.$clearCompleted, 'click',  function () { handler();                            });
		} else if ( event === 'toggleAll'       ) { $on(       self.$toggleAll,      'click',  function () { handler({ completed: this.checked }); });
		} else if ( event === 'itemEdit'        ) {	$delegate( self.$todoList, 'li label', 'dblclick',
		                                                                                       function () { handler({ id: self._itemId( this )}); });
		} else if ( event === 'itemRemove'      ) {	$delegate( self.$todoList, '.destroy', 'click',
		                                                                                       function () { handler({ id: self._itemId( this )}); });
		} else if ( event === 'itemToggle'      ) {	$delegate( self.$todoList, '.toggle', 'click',
		                                                                                       function () { handler({ id: self._itemId( this ),
					                                                                                                   completed: this.checked }); });
		} else if ( event === 'itemEditDone'    ) {	self._bindItemEditDone(   handler                                                               );
		} else if ( event === 'itemEditCancel'  ) {	self._bindItemEditCancel( handler                                                               ); }};

	window.app = window.app || {}; // Export to window
	window.app.View = View;
}( window ) );
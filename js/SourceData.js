/*jshint eqeqeq:false */
( function ( window ) {
    'use strict';

    /**
     * Creates a new client side storage object and will create an empty
     * collection if no collection already exists.
     *
     * @param {string} name The name of our DB we want to use
     * @param {function} callback Our fake DB uses callbacks because in
     * real life you probably would be making AJAX calls
     */
    class SourceData {
        constructor( configuration_object ) {
            this.RunnerObject = configuration_object.runner;
            this.url          = configuration_object.url;
        }

        /**
         * gets all objects from the database
         *
         * @param {function} callback The callback to fire upon retrieving data
         */
        getObjects( callback ) {
            let api_path = this.url + "object/select";
            let runner = new this.RunnerObject( api_path );
            let run_config = { type: "GET" }
            runner.run( run_config, callback );
        }

        /**
         * Will insert an object into the database. 
         *
         * @param {object} data_config The call type, object id and object data
         * @param {function} callback The callback to fire after inserting new data
         */
        insertObject( data_config, callback ) {
            let api_path = this.url + "object/insert";
            let runner = new this.RunnerObject( api_path );
            let run_config = { type: "POST",
                               object_view_id: data_config.object_view_id,
                               object_data:    data_config.object_data };
            runner( run_config, callback ); }

        /**
         * Will update an existing object in the database. 
         *
         * @param {object} data_config The call type, object id and object data
         * @param {function} callback The callback to fire after the update
         */
        updateObject( data_config, callback ) {
            let api_path = this.url + "object/update";
            let runner = new this.RunnerObject( api_path );
            let run_config = { type: "POST",
                               object_view_id: data_config.object_view_id,
                               object_data:    data_config.object_data };
            runner( run_config, callback ); }

        /**
             * Finds items based on a query given as a JS object
             *
             * @param {object} query The query to match against (i.e. {foo: 'bar'})
             * @param {function} callback	 The callback to fire when the query has
             * completed running
             *
             * @example
             * db.find({foo: 'bar', hello: 'world'}, function (data) {
             *	 // data will return any items that have foo: bar and
             *	 // hello: world in their properties
             * });
             */
        find ( query, callback ) {
            if ( !callback ) {
                return;
            }

            let todos = JSON.parse( localStorage.getItem( this._dbName ) );

            callback.call( this, todos.filter( function ( todo ) {
                for ( let q in query ) {
                    if ( query[ q ] !== todo[ q ] ) {
                        return false;
                    }
                }
                return true;
            } ) );
        }
        /**
             * Will retrieve all data from the collection
             *
             * @param {function} callback The callback to fire upon retrieving data
             */
        findAll ( callback ) {
            callback = callback || function () { };
            callback.call( this, JSON.parse( localStorage.getItem( this._dbName ) ) );
        }
        /**
             * Will save the given data to the DB. If no item exists it will create a new
             * item, otherwise it'll simply update an existing item's properties
             *
             * @param {object} updateData The data to save back into the DB
             * @param {function} callback The callback to fire after saving
             * @param {number} id An optional param to enter an ID of an item to update
             */
        save ( updateData, callback, id ) {
            let todos = JSON.parse( localStorage.getItem( this._dbName ) );

            callback = callback || function () { };

            // If an ID was actually given, find the item and update each property
            if ( id ) {
                for ( let i = 0; i < todos.length; i++ ) {
                    if ( todos[ i ].id === id ) {
                        for ( let key in updateData ) {
                            todos[ i ][ key ] = updateData[ key ];
                        }
                        break;
                    }
                }

                localStorage.setItem( this._dbName, JSON.stringify( todos ) );
                callback.call( this, todos );
            } else {
                // Generate an ID
                updateData.id = new Date().getTime();

                todos.push( updateData );
                localStorage.setItem( this._dbName, JSON.stringify( todos ) );
                callback.call( this, [ updateData ] );
            }
        }
        /**
             * Will remove an item from the SourceData based on its ID
             *
             * @param {number} id The ID of the item you want to remove
             * @param {function} callback The callback to fire after saving
             */
        remove ( id, callback ) {
            let todos = JSON.parse( localStorage.getItem( this._dbName ) );

            for ( let i = 0; i < todos.length; i++ ) {
                if ( todos[ i ].id == id ) {
                    todos.splice( i, 1 );
                    break;
                }
            }

            localStorage.setItem( this._dbName, JSON.stringify( todos ) );
            callback.call( this, todos );
        }
        /**
             * Will drop all storage and start fresh
             *
             * @param {function} callback The callback to fire after dropping the data
             */
        drop ( callback ) {
            let todos = [];
            localStorage.setItem( this._dbName, JSON.stringify( todos ) );
            callback.call( this, todos );
        }
    }

    // Export to window
    window.app = window.app || {};
    window.app.SourceData = SourceData;
} )( window );

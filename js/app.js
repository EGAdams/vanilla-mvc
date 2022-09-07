/*global app, $on */
( function () {
    'use strict';
    /**
     * Sets up a brand new MVC.
     *
     * @param {string} name The name of your new to do list.
     */
    function MVC( config ) {
        this.sourceData = new app.SourceData( config                ); // connects directly to data source.
        this.model      = new app.Model(      this.sourceData       ); // talks to sourceData.  program to this ( interface )
        this.template   = new app.Template(                         ); // holds skeleton that needs data
        this.view       = new app.View(       this.template         ); // manipulates the DOM
        this.controller = new app.Controller( this.model, this.view ); // the only way the model and view can communicate.
    }

    let config = {
        url: 'https://americansjewelry.com/test2/local-php-api/index.php/',
        runnerObject: XhrRunner } // has a run( callback ) method.
    
    let mvc = new MVC( config );

    function setView() { mvc.controller.setView( document.location.hash ); }
    $on( window, 'load'      , setView );
    $on( window, 'hashchange', setView );
})();

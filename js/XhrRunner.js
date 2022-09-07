/** @class XhrRunner class */
class XhrRunner {
    constructor( pathArg ) {  this.api_path = pathArg; } // establish communication address
        async run( run_config, callback ) {
            if ( strToUpper( run_config.type ) == "GET" ) {
                const xhr = new XMLHttpRequest();
                xhr.open( "GET", this.api_path, true );
                xhr.setRequestHeader( "Content-Type", "text/plain;charset=UTF-8" );
                xhr.onreadystatechange = function() {
                    let result_data = "";
                    if ( xhr.readyState === 4 && xhr.status === 200 ) {
                        try {
                            result_data = JSON.parse( xhr.responseText );
                        } catch( e ) {
                            console.log( "*** ERROR: failed to parse JSON data from server. ***" );
                            console.log( "*** ERROR: dataArg: " + xhr.responseText + " ***" ); }
                        if ( xhr.responseText.length != 0 ) {
                            callback( result_data ); }
                    } else {
                        console.log( "xhr.readyState: " + xhr.readyState );
                        console.log( "xhr.status: " + xhr.status ); }};
                xhr.send( this.api_path );
            } else if( strToUpper( run_config.type ) == "POST" ) {
                const xhr = new XMLHttpRequest();
                xhr.open( "POST", this.api_path, true );
                xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" ); // allows "sql="... syntax!
                xhr.onreadystatechange = function() {
                    let result_data = "";
                    if ( xhr.readyState === 4 && xhr.status === 200 ) {
                        try {
                            result_data = JSON.parse( xhr.responseText );
                        } catch( e ) {
                            console.log( "*** ERROR: failed to parse JSON data from server. ***" );
                            console.log( "*** ERROR: dataArg: " + xhr.responseText + " ***" ); }
                        if ( xhr.responseText.length != 0 ) {
                            callback( result_data );
                        }
                    } else {
                        console.log( "xhr.readyState: " + xhr.readyState );
                        console.log( "xhr.status: " + xhr.status ); }};
                let parameters = 'object_view_id=' + run_config.object_view_id + '&object_data=' + run_config.object_data;
                xhr.send( parameters ); }}
}

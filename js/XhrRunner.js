/** @class XhrRunner class */
class XhrRunner {
    constructor( pathArg ) {  this.api_path = pathArg; } // establish communication address
        async run( callback ) {
            const xhr = new XMLHttpRequest();
            xhr.open( "GET", this.api_path, true );
            xhr.setRequestHeader( "Content-Type", "text/plain;charset=UTF-8" ); // allows "sql="... syntax!
            xhr.onreadystatechange = function() {
                let result_data = "";
                if ( xhr.readyState === 4 && xhr.status === 200 ) {
                    try {
                        // console.log( "xhr.responseText: " + xhr.responseText );
                        result_data = JSON.parse( xhr.responseText );
                        // console.log( result_data );
                    } catch( e ) {
                        console.log( "*** ERROR: failed to parse JSON data from server. ***" );
                        console.log( "*** ERROR: dataArg: " + xhr.responseText + " ***" );
                    }
                    if ( xhr.responseText.length != 0 ) {
                        callback( result_data );
                    }
                } else {
                    // console.log( "xhr.readyState: " + xhr.readyState );
                    // console.log( "xhr.status: " + xhr.status );
                }
            };
            xhr.send( this.api_path );
        }
}

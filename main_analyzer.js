/**
 * @author Ikaros Kappler
 * @date 2014-04-17
 * @version 1.0.0
 **/

var dummy      = null;

function startAnalyzer() {
    
    // Clear output
    displayOutput( "", false );

    //window.alert( "X" );
    
    var inputText  = document.getElementById("input_text").value;
    var reader     = new IKRS.PushbackStringReader( inputText );
    
    dummy      = {
	sb: new IKRS.StringBuffer()
	//append: function( n, v ) { this.sb.append(n + ": " + v ); }
    };
    dummy.append = function( n, v ) { dummy.sb.append(n + ": " + v + "<br/>\n"); };
    //dummy.append( "x", "y" );
        
    
    var analyzer = new IKRS.Analyzer();
    try {

	analyzer.addRule( "REGISTER", 
			  "EAX|EBX|ECX|EDX|IP", 
			  /*
			  function( name, value ) {
			      //window.alert( name + "(REGISTER): " + value );
			      displayOutput( name + ": " + value + "<br/>\n", true );
			  }
			  */
			  dummy.append
			);
	analyzer.addRule( "MNEMONIC", 
			  "MV|CMP|JNE|ADD|CMP|JE|JNE|JMP|CMP|JLT|MUL|MOD|INC|DEC|SUB", 
			  /*function( name, value ) {
			      //window.alert( name + "(MNEMONIC): " + value );
			      displayOutput( name + ": " + value + "<br/>\n", true );
			  } */
			  dummy.append
			);
	analyzer.addRule( "NUMBER", 
			  "\\d+",
			  /*function( name, value ) {
			      //window.alert( name + "(NUMBER): " + value );
			      displayOutput( name + ": " + value + "<br/>\n", true );
			  } */
			  dummy.append
			);
	analyzer.addRule( "COMMENT", 
			  "#[^\\n\\f\\b]*[\\n\\f\\b]",
			  /*function( name, value ) {
			      //window.alert( name + "(COMMENT): " + value );
			      displayOutput( name + ": " + value + "<br/>\n", true );
			  }*/
			  dummy.append
			);
	analyzer.addRule( "PROCECURE_START", 
			  "PROC",
			  /*function( name, value ) {
			      //window.alert( name + "(PROCEDURE_START): " + value );
			      displayOutput( name + ": " + value + "<br/>\n", true );
			  }
			  */
			  dummy.append
			);
	analyzer.addRule( "PROCECURE_END", 
			  "/PROC",
			  /*function( name, value ) {
			      //window.alert( name + "(PROCEDURE_END): " + value );
			      displayOutput( name + ": " + value + "<br/>\n", true );
			  }*/
			  dummy.append
			);
	analyzer.addRule( "\w+:", 
			  "LABEL",
			  /*function( name, value ) {
			      //window.alert( name + "(LABEL): " + value );
			      displayOutput( name + ": " + value + "<br/>\n", true );
			  }*/
			  dummy.append
			);
	analyzer.addRule( "@\w+", 
			  "JUMP_DESTINATION",
			  /*function( name, value ) {
			      //window.alert( name + "(JUMP_DESTINATION): " + value );
			      displayOutput( name + ": " + value + "<br/>\n", true );
			  }*/
			  dummy.append
			);
	
	
	while( !reader.reachedEOI() && reader.available() > 0 ) {

	    //window.alert( "reader.position=" + reader.position + ", line=" + reader.lineNumber + ", column=" + reader.columnNumber );

	    var matchResult = analyzer.nextMatch( reader );
	    	    
	    if( matchResult == null ) {
		// First case: no match at all
		// Implies EOI
		
	    } else if( matchResult.matchLength == 0 ) {
		// Second case: found match has zero length
		// Consume one token
		var c = reader.read();
		window.alert( "Anonymous token: " + c );
		
	    } else {
		// Last case: found match has length > 0
		// Action was already triggered ^^
		
	    }

	}
	
	displayOutput( dummy.sb.toString(), true );
	
    } catch( e ) {
	displayOutput( "Error: " + e, true );
	throw e;
    }
    
}





function displayOutput( data, append ) {
    if( append )
	document.getElementById( "output_div" ).innerHTML += data;
    else
	document.getElementById( "output_div" ).innerHTML = data;
}
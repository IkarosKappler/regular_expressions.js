/**
 * @author Ikaros Kappler
 * @date 2014-04-17
 * @version 1.0.0
 **/

var dummy      = null;

function startAnalyzer() {
    
    // Clear output.
    displayOutput( "", false );
    
    // Fetch input text from the text field and create a reader object.
    var inputText  = document.getElementById("input_text").value;
    var reader     = new IKRS.PushbackStringReader( inputText );
    
    // Make a dummy object to store matching results in (will be the syntax-highted output).
    dummy      = {
	sb: new IKRS.StringBuffer()
    };  
    dummy.append = function( n, v, matchResult, callbackParams ) { 
	// Convert TEXT line breaks to HTML line breaks
	dummy.sb.append("<span style=\"color: " + callbackParams.fontColor + ";\">" + v.replace(/(\r\n|\n|\r)/gm,"<br/>\n") + "</span>"); 
    };
    
        
    
    var analyzer = new IKRS.Analyzer();
    try {

	analyzer.addRule( "REGISTER",               // Any name for this rule. Duplicates allowed.
			  "EAX|EBX|ECX|EDX|IP",     // The regular expression to be matched.
			  dummy.append,             // The callback function to call on input match.
			  { fontColor: "#00a800" }  // Any custom object. Will be passed as 'callbackParams' to the callback function
			);
	analyzer.addRule( "MNEMONIC", 
			  "MV|CMP|JNE|ADD|CMP|JE|JNE|JMP|JGT|CMP|JLT|MUL|MOD|INC|DEC|SUB|RETR|RETURN|PUSH|CALL|POP|MALLOC|MDEALLOC", 
			  function(name,value,matchResult) { 
			      dummy.sb.append("<span style=\"font-weight: bold;\">" + value + "</span>"); 
			  },
			  { fontColor: "#a8a8a8" }
			);
	analyzer.addRule( "NUMBER", 
			  "\\d+",
			  dummy.append,
			  { fontColor: "#8800a8" }
			);
	analyzer.addRule( "COMMENT", 
			  "#[^\\n\\f\\b]*[\\n\\f\\b]",
			  //function(name,value,matchResult) { window.alert(value); }, //
			  dummy.append,
			  { fontColor: "#880000" }
			);
	analyzer.addRule( "PROCECURE_START", 
			  "PROC",
			  dummy.append,
			  { fontColor: "#FF6800" }
			);
	analyzer.addRule( "PROCECURE_END", 
			  "/PROC",
			  dummy.append,
			  { fontColor: "#FF6800" }
			);
	analyzer.addRule( "CALL_DESTINATION",
			  "@@\\w+",
			  dummy.append, 
			  { fontColor: "#2888ff" }
			);
	analyzer.addRule( "LABEL",
			  "\\w+:", 
			  dummy.append,
			  { fontColor: "#2828ff" }
			);
	analyzer.addRule( "JUMP_DESTINATION",
			  "@\\w+",
			  dummy.append, 
			  { fontColor: "#2828ff" }
			);
	// Convert TEXT line breaks to HTML line breaks
	analyzer.addRule( "LINE_BREAK",
			  "\\n", 
			  function(name,value,matchResult) { dummy.sb.append(value+"<br/>\n"); },
			  { fontColor: "#880088" }
			);

	// Convert TEXT whitespace to HTML whitespace
	analyzer.addRule( "WHITE_SPACE",
			  "\\s", 
			  function(name,value,matchResult) { dummy.sb.append("&nbsp;"); }, 
			  { fontColor: "#880088" }
			);

	// Finally add a 'terminator' rule that matches everything.
	// This is not necessarily required but a more elegant solution than
	// handling no-match events manually.	
	analyzer.addRule( "TERMINATOR",
			  ".",
			  function(name,value,matchResult) { 
			      dummy.sb.append(value); 
			  }, 
			  { fontColor: "#880088" }
			);
	



	// Display installed rules
	var str = "Installed rules:<br/>\n";
	for( var i = 0; i < analyzer.rules.length; i++ ) {
	    str += "[Rule #" + i +"] " + analyzer.rules[i].name + ": " + analyzer.rules[i].regex + "<br/>\n";
	}
	str += "<br/><br>\n\n";
	str += "<b>Result:</b><br/>\n";
	displayOutput( str, true );
	
	
	var GET_FIRST_MATCH = true;  // alternative: get longest match (not wha we want here)
	var startTime       = new Date().getTime();
	while( !reader.reachedEOI() && reader.available() > 0 ) {

	    var matchResult = analyzer.nextMatch( reader, GET_FIRST_MATCH );
	    	    
	    if( matchResult == null ) {
		// First case: no rule could be matched.
		// Consume current token
		var c = reader.read();
		dummy.sb.append( "_anonymous_:" + c + "<br/>\n" );

	    } else if( matchResult.matchLength == 0 ) {
		// Second case: found match has zero length
		// Consume one token
		var c = reader.read();
		dummy.sb.append( "_anonymous_:" + c + "<br/>\n" );
		
	    } else {
		// Last case: found match has length > 0
		// Action was already triggered ^^
		
	    }

	}	
	displayOutput( dummy.sb.toString(), true );
	var endTime = new Date().getTime();
	displayOutput( "Runtime: " + (endTime-startTime) + "ms.<br/>\n", true );
	
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
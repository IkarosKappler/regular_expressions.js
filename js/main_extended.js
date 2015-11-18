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
	dummy.sb.append("<span style=\"color: " + callbackParams.fontColor + "; font-weight: " + callbackParams.fontWeight + ";\">" + v.replace(/(\r\n|\n|\r)/gm,"<br/>\n") + "</span>"); 
    };
    
        
    
    var analyzer = new IKRS.Analyzer();
    try {

	analyzer.addRule( "function",               // Any name for this rule. Duplicates allowed.
			  "function",               // The regular expression to be matched.
			  dummy.append,             // The callback function to call on input match.
			  { fontColor: "#990099", fontWeight: "bold" }  // Any custom object. Will be passed as 'callbackParams' to the callback function
			);
	analyzer.addRule( "new", 
			  "new", 
			  dummy.append,
			  { fontColor: "#a800a8" }
			);
	analyzer.addRule( "var", 
			  "var", 
			  dummy.append,
			  { fontColor: "#00a8a8", fontWeight: "bold" }
			);
	analyzer.addRule( "return", 
			  "return", 
			  dummy.append,
			  { fontColor: "#a800a8" }
			);
	analyzer.addRule( "CONTROL_STRUCT", 
			  "if|else|for|while|do", 
			  dummy.append,
			  { fontColor: "#0048f8" }
			);
	analyzer.addRule( "SPECIAL_FUNCTIONS", 
			  "constructor|call", 
			  dummy.append,
			  { fontColor: "#990099" }
			);
	analyzer.addRule( "SPECIAL_MEMBERS", 
			  "prototype", 
			  dummy.append,
			  { fontColor: "#00a8a8" }
			);
	analyzer.addRule( "NUMBER", 
			  "\\d+",
			  dummy.append,
			  { fontColor: "#00a800" }
			);
	analyzer.addRule( "SINGLE_LINE_COMMENT", 
			  "//[^\\n\\f\\b]*[\\n\\f\\b]",
			  dummy.append,
			  { fontColor: "#880000" }
			);	
	analyzer.addRule( "MULTI_LINE_COMMENT_typeA", // Ending with ".*/" and NOT ".**/"
			  "/\\*(\\*([^/\\*])|[^\\*])*\\*/", // "/\\*(\\*([^/\\*]{0,1})|[^\\*])*\\*/", // /\\*([\\*][^/]|[^\\*])*(\\*/|\\*\\*/)",
			  //function(name,value,matchResult) { window.alert("comment"); }, //null, 
			  dummy.append,
			  { fontColor: "#880000" }
			);
	analyzer.addRule( "MULTI_LINE_COMMENT_typeB", // Ending with ".**/" and NOT ".*/"
			  "/\\*(\\*([^/\\*])|[^\\*])*\\*\\*/", 
			  //function(name,value,matchResult) { window.alert("comment"); }, //null, 
			  dummy.append,
			  { fontColor: "#880000" }
			);
	analyzer.addRule( "STRING_typeA",  // A string enclosed in double quotes
			  '"([^"]|\\\\")*"', 
			  dummy.append,
			  { fontColor: "#00a800" }
			);
	analyzer.addRule( "STRING_typeB",  // A string enclosed in single quotes
			  "'([^']|\\\\')*'", 
			  dummy.append,
			  { fontColor: "#00a800" }
			);
	// Convert TEXT line breaks to HTML line breaks
	analyzer.addRule( "LINE_BREAK",
			  "\\n", 
			  function(name,value,matchResult,callbackParams) { dummy.sb.append(value+"<br/>\n"); },
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

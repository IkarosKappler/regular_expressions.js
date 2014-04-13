/**
 * @author Ikaros Kappler
 * @date 2014-04-05
 * @version 1.0.0
 **/

function testPushbackStringReader() {

    var stringData = document.getElementById( "input_regex" ).value;
    
    var pbr        = new IKRS.PushbackStringReader( stringData,
						    0,
						    stringData.length
						  );
    
    var result = "";
    result += pbr.toString() + "<br/>\n";
    
    var i = 0;
    var stat = pbr.read();
    result += "First character read: " + stat + "; unread(1)<br/>\n";
    pbr.unread( 1 );
    
    //window.alert( stat );
    while( i < 10 && (stat = pbr.read()) != -1 ) {

	result += "[" + i + "] position=" + pbr.getPosition() + ", line=" + pbr.getLineNumber() + ", col=" + pbr.getColumnNumber() + ", char=" + pbr.getCurrentCharacter() + ", charCode=" + pbr.getCurrentCharacterCode() + "<br/>\n";

	i++;
    }
    
    result += "Unread one character.<br/>\n";
    pbr.unread(1);
    result += "pbr.mark();<br/>\n";
    pbr.mark();

    while( (stat = pbr.read()) != -1 ) {

	result += "[" + i + "] position=" + pbr.getPosition() + ", line=" + pbr.getLineNumber() + ", col=" + pbr.getColumnNumber() + ", char=" + pbr.getCurrentCharacter() + ", charCode=" + pbr.getCurrentCharacterCode() + "<br/>\n";

	i++;
    }

    result += "pbr.reset();<br/>\n";
    pbr.reset();
    while( (stat = pbr.read()) != -1 ) {

	result += "[" + i + "] position=" + pbr.getPosition() + ", line=" + pbr.getLineNumber() + ", col=" + pbr.getColumnNumber() + ", char=" + pbr.getCurrentCharacter() + ", charCode=" + pbr.getCurrentCharacterCode() + "<br/>\n";

	i++;
    }
    

    result += "END OF TEST<br/>\n";
    displayOutput( result, false );
}


function testRegexTokenizer() {

    var stringData = document.getElementById( "input_regex" ).value;
    
    var pbr        = new IKRS.PushbackStringReader( stringData,
						    0,
						    stringData.length
						  );
    var tokenizer  = new IKRS.RegexTokenizer( pbr );
    var result     = "";
    var token;
    var i = 0;
    while( (token = tokenizer.nextToken()) != null ) {

	result += token.toString() + "<br/>\n";
	i++;
    }

    result += i + " token(s) found.<br/>\n";
    displayOutput( result, false );
}

function testRegexParser( displaySuccess ) {
    
    var startTime  = new Date().getTime();

    var inputElem  = document.getElementById( "input_regex" );
    var stringData = inputElem.value;
    
    var pbr        = new IKRS.PushbackStringReader( stringData,
						    0,
						    stringData.length
						  );
    var tokenizer  = new IKRS.RegexTokenizer( pbr );
    var parser     = new IKRS.RegexParser( tokenizer );
    try {
	var regex      = parser.parse();	
	
	var endTime    = new Date().getTime();

	if( displaySuccess ) {
	    var result = "Result RegEx=" + regex.toString() + "<br/>\n";
	    result += "<pre>\n";
	    result += pattern2string( regex );
	    result += "</pre><br/>\n";
	    result += "<b>Runtime: " + (endTime - startTime) + "ms<br/>\n";
	    displayOutput( result, false );
	}
	return regex;
    } catch( e ) {
	// The exception should be a ParseException.
	// (Runtime errors of course do not occur ^^)
	if( e.errorMessage ) {
	    displayOutput( "Parse Error: " + e.errorMessage + " at " + e.startOffset, false );

	    inputElem.focus();
	    if( inputElem.setSelectionRange )
		inputElem.setSelectionRange( e.startOffset, e.endOffset ); 
	    
	} else {
	    displayOutput( e );
	    throw e;  // For error tracking
	}
	return null;
    }

}

function testRegex() {
    
    var regex = testRegexParser( true );  // Don't display success message
    if( regex == null )
	return; // Error message already displayed
    
    var inputMatching  = document.getElementById( "input_text_match" ).value;
    var readerMatching = new IKRS.PushbackStringReader( inputMatching );
    try {
	
	var matchResult   = regex.match( readerMatching );
	for( var i = 0; i < matchResult.length; i++ ) {

	    displayOutput( "Matching["+ i +"]: " + matchResult + "<br/>\n", 
			   true 
			 );
	}

    } catch( e ) {
    
	if( e.errorMessage) {
	    displayOutput( "Error: " + e.errorMessage );
	} else {
	    displayOutput( e, true );
	    throw e;
	}

    }

}

function displayOutput( data, append ) {
    if( append )
	document.getElementById( "output_div" ).innerHTML += data;
    else
	document.getElementById( "output_div" ).innerHTML = data;
}
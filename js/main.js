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
	    result += "" + parser.warnings.length + " warning(s)<br/>\n";
	    for( var i = 0; i < parser.warnings.length; i++ )
		result += "<div style=\"margin-left: 25px;\">#" + i + ": " + parser.warnings[i] + "</div>\n";
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
    
    var inputMatching    = document.getElementById( "input_text_match" ).value;
    var inputUnmatching  = document.getElementById( "input_text_nomatch" ).value;

    var readerMatching   = new IKRS.PushbackStringReader( inputMatching );
    var readerUnmatching = new IKRS.PushbackStringReader( inputUnmatching );

    var regexText        = document.getElementById( "input_regex" ).value;

    _testRegex( regex, regexText, inputMatching );
    _testRegex( regex, regexText, inputUnmatching );
} 

function _testRegex( regex, regexText, inputText ) {
    try {
	
	displayOutput( "Running RegEx <code>" + regexText + "</code> against input: <code>" + inputText + "</code><br/>\n", true );
	var reader = new IKRS.PushbackStringReader( inputText );
	var matchResult   = regex.match( reader );
	//window.alert( regex.toString() + ", " + regex.);
	displayOutput( "" + matchResult.length + " sub result(s) found.<br/>\n", true );
	var longestMatch = -1;
	for( var i = 0; i < matchResult.length; i++ ) {

	    displayOutput( "Matching["+ i +"]: " + matchResult[i] + "<br/><br/>\n", 
			   true 
			 );
	    longestMatch = Math.max( longestMatch, matchResult[i].matchLength );
	}
	// At least one partial must must match the whole input
	if( longestMatch <= 0 )
	    displayOutput( "<div class=\"match_empty\">[No Match] No input characters could be matched!</div>\n", true );
	else if( longestMatch < inputText.length ) 
	    displayOutput( "<div class=\"match_partial\">[Partial Match] Not all input characters could be matched (only a prefix with length " + longestMatch + "):</div>\n<code>" + inputText.substr(0,longestMatch)+ "</code>\n<br/>" , true );
	else
	    displayOutput( "<div class=\"match_full\">[Full Match] All " + longestMatch + " input characters could be matched.</div>\n", true );
	
	displayOutput( "<br/><br/><br/>", true );

    } catch( e ) {
    
	if( e.errorMessage) {
	    displayOutput( "Error: " + e.errorMessage );
	} else {
	    displayOutput( e, true );
	    throw e;
	}
    }

}



function testTokenizeInput() {
    
    var regex = testRegexParser( true );  // Don't display success message
    if( regex == null )
	return; // Error message already displayed
    
    var inputMatching    = document.getElementById( "input_text_match" ).value;
    var inputUnmatching  = document.getElementById( "input_text_nomatch" ).value;

    var readerMatching   = new IKRS.PushbackStringReader( inputMatching );
    var readerUnmatching = new IKRS.PushbackStringReader( inputUnmatching );

    var regexText        = document.getElementById( "input_regex" ).value;

    _testTokenizeInput( regex, regexText, inputMatching );
    //_testTokenizeInput( regex, regexText, inputUnmatching );
}

function _testTokenizeInput(  regex, regexText, inputText ) {
    try {
	
	displayOutput( "Running RegEx <code>" + regexText + "</code> against input: <code>" + inputText + "</code><br/>\n", true );

	var reader = new IKRS.PushbackStringReader( inputText );
	var longestMatch = null;
	var i = 0;
	do {

	    var matchResult = regex.match( reader );
	    longestMatch    = IKRS.Analyzer._getLongestMatch( matchResult, 
							      true         // allowZeroLength
							    );
	    displayOutput( "[" + i +"] longestMatch=" + longestMatch + "<br/>\n", true );
	    
	    
	    if( longestMatch != null ) {
		displayOutput( "<div style=\"margin-left: 25px; font-family: Monospace;\">" + inputText.substr(longestMatch.beginMark.position+1,longestMatch.matchLength) + "</div>\n", true );
		reader.resetTo( longestMatch.endMark );
	    } else {
		displayOutput( "No longest match found.\n", true );
	    }

	    i++;
	} while( longestMatch != null && 
		 longestMatch.matchStatus == IKRS.MatchResult.STATUS_COMPLETE && 
		 longestMatch.matchLength > 0 
	       );

	displayOutput( "<br/><br/><br/>", true );

    } catch( e ) {
    
	if( e.errorMessage) {
	    displayOutput( "Error: " + e.errorMessage );
	} else {
	    displayOutput( e, true );
	    throw e;
	}
    }

}


/*
function _getLongestMatch( matchResult ) {
    var index  = _locateLongestMatch( matchResult );
    if( index == -1 )
	return null;
    else
	return matchResult[ index ];
}

function _locateLongestMatch( matchResult ) {
    var index  = -1;
    var length = -1;
    for( var i = 0; i < matchResult.length; i++ ) {
	if( matchResult[i].matchStatus == IKRS.MatchResult.STATUS_COMPLETE && matchResult[i].matchLength > length ) {
	    index  = i;
	    length = matchResult[i].matchLength;
	}
    }
    
    return index;
}
*/


function displayOutput( data, append ) {
    if( append )
	document.getElementById( "output_div" ).innerHTML += data;
    else
	document.getElementById( "output_div" ).innerHTML = data;
}
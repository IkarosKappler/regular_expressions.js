
/**
 * @author Ikaros Kappler
 * @date 2014-04-05
 * @version 1.0.0
 **/

function testPushbackStringReader() {
    
    //window.alert( "X" );

    var stringData = document.getElementById( "input_text" ).value;
    
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
    displayOutput( result );
}


function testRegexTokenizer() {
    
    //window.alert( "X" );

    var stringData = document.getElementById( "input_text" ).value;
    
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
    displayOutput( result );
}

function testRegexParser() {
    
    //window.alert( "X" );

    var stringData = document.getElementById( "input_text" ).value;
    
    var pbr        = new IKRS.PushbackStringReader( stringData,
						    0,
						    stringData.length
						  );
    var tokenizer  = new IKRS.RegexTokenizer( pbr );
    var parser     = new IKRS.RegexParser( tokenizer );
    //try {
	var regex      = parser.read();	

    var result = "Result RegEx=" + regex.toString() + "<br/>\n";
    result += "<pre>\n";
    result += pattern2string( regex );
    result += "</pre>\n";
    displayOutput( result );
    /*} catch( e ) {
	displayOutput( e );
    }*/

}

function displayOutput( data ) {
    document.getElementById( "output_div" ).innerHTML = data;
}
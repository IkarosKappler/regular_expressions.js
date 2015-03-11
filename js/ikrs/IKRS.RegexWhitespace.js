/**
 * The predefined character class for whitespace (\s) respective (\S).
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 * Whitespace characters are:
 *  - 0x20 (' ')   The regular space character.
 *  - \n           Line break.
 *  - 0x0B         Line Feed.
 *  - \t           Tabulator.
 *  - \f           Form Feed.
 *  - \r           Carriage Return.
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexWhitespace = function( token, negate ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     (negate ? "NON-WHITESPACE[\\S]" : "WHITESPACE[\\s]") 
				   );


    this.negate = negate;
    
};


/**
 * @override
 **/
IKRS.RegexWhitespace.prototype.match = function( reader ) {
    
    // Create read mark at current position.
    var beginMark = reader.getMark();
	
    // Is there any input available at all?	
    if( reader.reachedEOI() || reader.available() == 0 ) {
	// Nothing to read
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       0,               // length is 0
				       beginMark, 
				       reader.getMark() 
				     ) ]; 
    } else {
	// Read exactly one anonymous symbol (convert to string)
	var c = new String("" + reader.read());
	//window.alert( "symbol read: " + c );
	
	// Decide if it is a whitespace character.
	var isWhitespace = 
	    ( c == ' ' ||
	      c == '\n' || 
	      c.charCodeAt(0) == 0x0B ||
	      c == '\t' ||
	      c == '\f' 
	    );

	//window.alert( "symbol read: " + c + ", isWhitespace=" + isWhitespace );

	if( (this.negate && isWhitespace) || (!this.negate && !isWhitespace) ) {

	    // Match fail
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   0,               // matchLength is 0
					   beginMark, 
					   reader.getMark() 
					 ) ]; 	   

	} else {
	    
	    // Match success
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					   1,               // matchLength is 1
					   beginMark, 
					   reader.getMark()
					 ) ];
	}
    }
	

};

/*
IKRS.RegexWhitespace.prototype.toString = function() {

    if( this.token.isEscaped )
	return this.token.rawValue;    // Eventually the *real* character value is not printable
    else
	return this.token.value;
};
*/


IKRS.RegexWhitespace.prototype.constructor     = IKRS.RegexWhitespace;

IKRS.RegexWhitespace.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexWhitespace.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexWhitespace.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexWhitespace.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexWhitespace.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;


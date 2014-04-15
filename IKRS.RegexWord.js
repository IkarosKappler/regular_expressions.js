/**
 * The predefined character class for word characters (in a programmer's sense), (\w) respective (\W).
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 * Word characters are:
 *  - Digits: [0-9].
 *    OR
 *  - Lowercase characters: [a-z]
 *    OR
 *  - Uppercase characters: [A-Z]
 *    OR
 *  - Underscore: _
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexWord = function( token, negate ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     (negate ? "NON-DIGIT[\\D]" : "DIGIT[\\s]") 
				   );


    this.negate = negate;
    
};


/**
 * @override
 **/
IKRS.RegexWord.prototype.match = function( reader ) {
    
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
	
	// Decide if it is a digit character.
	var isWordCharacter = 
	    (
		( c.charCodeAt(0) >= 0x30 && c.charCodeAt(0) <= 0x39 ) || // is digit?
		( c.charCodeAt(0) >= 0x61 && c.charCodeAt(0) <= 0x7A ) || // is lowercase character?
		( c.charCodeAt(0) >= 0x41 && c.charCodeAt(0) <= 0x5A ) || // is uppercase character?
		c == '_'                                                  // is underscore?
	    );


	if( (this.negate && isWordCharacter) || (!this.negate && !isWordCharacter) ) {

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


IKRS.RegexWord.prototype.constructor     = IKRS.RegexWord;

IKRS.RegexWord.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexWord.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexWord.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexWord.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexWord.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;


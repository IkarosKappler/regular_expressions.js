/**
 * The predefined character class for digits (\d) respective (\D).
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 * Digit characters are 0, 1, 2, ... , 9, or short: [0-9].
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexDigit = function( token, negate ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     (negate ? "NON-DIGIT[\\D]" : "DIGIT[\\s]") 
				   );


    this.negate = negate;
    
};


/**
 * @override
 **/
IKRS.RegexDigit.prototype.match = function( reader ) {
    
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
	var isDigit = 
	    ( c.charCodeAt(0) >= 0x30 && c.charCodeAt(0) <= 0x39 );


	if( (this.negate && isDigit) || (!this.negate && !isDigit) ) {

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


IKRS.RegexDigit.prototype.constructor     = IKRS.RegexDigit;

IKRS.RegexDigit.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexDigit.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexDigit.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexDigit.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexDigit.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;


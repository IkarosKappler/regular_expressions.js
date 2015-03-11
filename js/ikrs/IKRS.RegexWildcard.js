/**
 * The Wildcard RegEx class. The wildcard matches any character from the input.
 *
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexWildcard = function( token ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     "WILDCARD[.]" 
				   );

    
};


/**
 * @override
 **/
IKRS.RegexWildcard.prototype.match = function( reader ) {
    
    // Fetch current read mark.
    var beginMark = reader.getMark();


    if( reader.reachedEOI() || reader.available() == 0 ) {
	// Nothing to read
	//reader.read();
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       0,      // length is 0
				       beginMark, 
				       reader.getMark() // beginMark
				     ) ]; 
    } else {
	// Read exactly one anonymous symbol
	reader.read();
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
				       1,      // length is 1
				       beginMark, 
				       reader.getMark()
				     ) ];
    }
    

};


IKRS.RegexWildcard.prototype.constructor     = IKRS.RegexWildcard;

IKRS.RegexWildcard.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexWildcard.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexWildcard.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexWildcard.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexWildcard.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;


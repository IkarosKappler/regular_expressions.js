/**
 * The RegEx class for END-OF-INPUT (EOI) which is no actual symbol from the input but more
 * the complementary part of BEGIN-OF-INPUT.
 *
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexEndOfInput = function( token ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     "END-OF-INPUT[^]" 
				   );

    
};


/**
 * @override
 **/
IKRS.RegexEndOfInput.prototype.match = function( reader ) {
    
    // Fetch current read mark.
    var beginMark = reader.getMark();


    var status = null;
    if( reader.reachedEOI() || reader.available() == 0 )  status = IKRS.MatchResult.STATUS_COMPLETE;
    else                                                  status = IKRS.MatchResult.STATUS_FAIL;
    
    //reader.read();
    return [ new IKRS.MatchResult( status,
				   0,      // length is 0 or 1? END-OF-INPUT is no real consumable symbol ...
				   beginMark, 
				   beginMark
				 ) ];
    

};


IKRS.RegexEndOfInput.prototype.constructor     = IKRS.RegexEndOfInput;

IKRS.RegexEndOfInput.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexEndOfInput.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexEndOfInput.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexEndOfInput.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexEndOfInput.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;


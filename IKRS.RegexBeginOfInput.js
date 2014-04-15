/**
 * The RegEx class for BEGIN-OF-INPUT which is no actual symbol from the input but more
 * the complementary part of END-OF-INPUT (EOI).
 *
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexBeginOfInput = function( token ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     "BEGIN-OF-INPUT[^]" 
				   );


    
};


/**
 * @override
 **/
IKRS.RegexBeginOfInput.prototype.match = function( reader ) {
    
    // Fetch current read mark.
    var beginMark = reader.getMark();

    
    var status = null;
    if( reader.atBeginOfInput() )    status = IKRS.MatchResult.STATUS_COMPLETE;
    else                             status = IKRS.MatchResult.STATUS_FAIL;
    
    
    return [ new IKRS.MatchResult( status,
				   0,      // length is 0, because BEGIN-OF-INPUT is no real consumable symbol
				   beginMark, 
				   beginMark
				 ) ];
    

};


IKRS.RegexBeginOfInput.prototype.constructor     = IKRS.RegexBeginOfInput;

IKRS.RegexBeginOfInput.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexBeginOfInput.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexBeginOfInput.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexBeginOfInput.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexBeginOfInput.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;


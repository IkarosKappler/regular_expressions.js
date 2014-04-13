/**
 * @author Ikaros Kappler
 * @date 2014-04-10
 * @version 1.0.0
 **/


IKRS.RegexCharacter = function( token ) {

    IKRS.Pattern.call( this, "CHARACTER[" + token.value + "]" );

    /*this.characterValue = characterValue;
    this.characterCode  = characterCode;
    this.rawValue       = rawValue;
    */
    this.token = token;
    
    // Also add to children list
    //this.children.push( token );
};


IKRS.RegexCharacter.prototype.match = function( reader ) {
    // Try to read one token from the reader
 
    var c     = reader.read();
    
    if( c == -1 ) {
	// EOI is no real character
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_INCOMPLETE,
				       0,
				       0
				     ) 
	       ];
    } else if( c != this.token.value ) {
	// Token does not match
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       0,
				       0
				     )
	       ];
	
	
    } else {

	// Expected character found.
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
				       0,
				       1
				     )
	       ];
    }
};

IKRS.RegexCharacter.prototype.toString = function() {
    if( this.token.isEscaped )
	return this.token.rawValue;    // Eventually the *real* character value is not printable
    else
	return this.token.value;
};


IKRS.RegexCharacter.prototype.constructor     = IKRS.RegexCharacter;

IKRS.RegexCharacter.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexCharacter.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexCharacter.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexCharacter.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

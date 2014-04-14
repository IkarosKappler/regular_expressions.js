/**
 * @author Ikaros Kappler
 * @date 2014-04-12
 * @version 1.0.0
 **/


IKRS.RegexSpecialCharacter = function( token ) {

    IKRS.Pattern.call( this, "SPECIAL[" + token.value + "]" );


    this.token = token;
    
    // Also add to children list?
    //this.children.push( token );
};


IKRS.RegexSpecialCharacter.prototype.match = function( reader ) {
    
    var beginMark = reader.getMark();


    if( this.token.isBeginOfInputCharacter() ) {
	
	var status = null;
	if( reader.atBeginOfInput() )    status = IKRS.MatchResult.STATUS_COMPLETE;
	else                             status = IKRS.MatchResult.STATUS_FAIL;
	    
	    
	return [ new IKRS.MatchResult( status,
				       0,      // length is 0, because BEGIN-OF-INPUT is no real consumable symbol
				       beginMark, 
				       beginMark
				     ) ];
	

    } else if( this.token.isEndOfInputCharacter() ) {
	
	var status = null;
	if( reader.reachedEOI() || reader.available() == 0 )  status = IKRS.MatchResult.STATUS_COMPLETE;
	else                                                  status = IKRS.MatchResult.STATUS_FAIL;
	
	reader.read();
	return [ new IKRS.MatchResult( status,
				       1,      // length is 0 or 1? BEGIN-OF-INPUT is no real consumable symbol ...
				       beginMark, 
				       beginMark
				     ) ];
	

    } else if( this.token.isWildcardCharacter() ) {
	
	//window.alert( "isWildCard; reader.position=" + reader.position + ", reachedEOI=" + reader.reachedEOI() + ", available=" + reader.available() );

	// Is there any input available at all?	
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
	
    } else {
	// This must not happen!
	// IF it happens then the parser is faulty.
	throw "[IKRS.RegexSpecialCharacter] Runtime Error: my internal token is NOT a special character (" + token.rawValue + ").";
    }
};

IKRS.RegexSpecialCharacter.prototype.toString = function() {
    
    if( this.token.isEscaped )
	this.token.rawValue;    // Eventually the *real* character value is not printable
    else
	return this.token.value;
    
};


IKRS.RegexSpecialCharacter.prototype.constructor     = IKRS.RegexSpecialCharacter;

IKRS.RegexSpecialCharacter.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexSpecialCharacter.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexSpecialCharacter.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexSpecialCharacter.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
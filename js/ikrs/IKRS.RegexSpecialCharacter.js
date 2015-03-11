/**
 * This is an abstract super class for all predefined character classes.
 *
 * Each subclass MUST implement the match() function!
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-12
 * @version 1.0.0
 **/


IKRS.RegexSpecialCharacter = function( token, name ) {

    IKRS.Pattern.call( this, (name == null ? "SPECIAL[" + token.rawValue + "]" : name) );


    this.token = token;
    
    // Also add to children list?
    //this.children.push( token );
};


IKRS.RegexSpecialCharacter.prototype.match = function( reader ) {
    

    throw "[IKRS.RegexSpecialCharacter.match(...)] This class is abstract and the 'match' function must be overridden by its subclasses before it can be used.";

    /*
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

    */
};

IKRS.RegexSpecialCharacter.prototype.toString = function() {
    
    if( this.token.isEscaped )
	return this.token.rawValue;    // Eventually the *real* character value is not printable
    else
	return this.token.value;
    
};


/**
 * This static function is used by the parser to keep the code small.
 *
 * It decides from the passed special character token which RegEx class should be used.
 *
 *
 **/
IKRS.RegexSpecialCharacter.createFromToken = function( token ) {

    if( !token.isSpecialCharacter() )
	throw "[IKRS.RegexSpecialCharacter.createFromToken(...){static}] Cannot create RegExp from token '" + token.rawValue + "'. It seems not to be a special character. Does your parser work correctly?";

    
    if( token.isBeginOfInputCharacter() )
	return new IKRS.RegexBeginOfInput(token);   
    else if( token.isEndOfInputCharacter() )
	return new IKRS.RegexEndOfInput(token);    
    else if( token.isWildcardCharacter() )
	return new IKRS.RegexWildcard(token); // RegexSpecialCharacter(token);
    else if( token.isDigitClassCharacter() ) 
	return new IKRS.RegexDigit( token,      false );  // Don't negate the set
    else if( token.isNonDigitClassCharacter() )
	return new IKRS.RegexDigit( token,      true );   // Negate the set
    else if( token.isWhitespaceClassCharacter() )
	return new IKRS.RegexWhitespace( token, false );  // Don't negate the set
    else if( token.isNonWhitespaceClassCharacter() )
	return new IKRS.RegexWhitespace( token, true );   // Negate the set
    else if( token.isWordClassCharacter() )
	return new IKRS.RegexWord( token,       false );  // Don't negate the set
    else if( token.isNonWordClassCharacter() )
	return new IKRS.RegexWord( token,       true );   // Negate the set
    else
	throw "[IKRS.RegexSpecialCharacter.createFromToken(...){static}] Cannot create RegExp from token '" + token.rawValue + "'. It is a special character but does not match any expected case. Does your parser work correctly?";

};


IKRS.RegexSpecialCharacter.prototype.constructor     = IKRS.RegexSpecialCharacter;

IKRS.RegexSpecialCharacter.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexSpecialCharacter.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexSpecialCharacter.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexSpecialCharacter.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

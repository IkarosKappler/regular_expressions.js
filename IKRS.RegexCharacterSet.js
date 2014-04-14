/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/

/**
 * The passed characters array must consist (if not null) of IKRS.RegexToken
 * instances.
 **/
IKRS.RegexCharacterSet = function( negate, opt_characters ) {

    IKRS.Pattern.call( this, "SET[...]" );

    this.negate            = negate;
    
    if( opt_characters != null )
	this.characters = opt_characters;
    else
	this.characters        = [];
    
};

/**
 * The start- and endSymbol params must be of type IKRS.RegexCharacter.
 **/
IKRS.RegexCharacterSet.prototype.addCharacter = function( character ) {
    this.characters.push( character );
    
    // Also add to children?
    //this.children.push( character );
};

IKRS.RegexCharacterSet.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // Read one character from the reader.
    var c = reader.read();
    
    // And try to match it.
    if( c == -1 ) {

	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       //0,
				       0,
				       beginMark,
				       reader.getMark()
				     )
	       ];

    } else if( this.negate ) {

	for( var i = 0; i < this.characters.length; i++ ) {
	    // Negation. No character must match.
	    var token = this.characters[i];
	    if( token.value == c ) {
		return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					       //0,  // read index 0 of input
					       0,   // 0 characters matched
					       beginMark,
					       reader.getMark()
					     )
		       ];
	    }	    	    
	} // END for
	// Loop terminated: character does not belong to negated set.
	// -> matches
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
				       //0,  // read index 0 of input
				       1,   // 1 character matching
				       beginMark,
				       reader.getMark()
				     )
	       ];

    } else {

	for( var i = 0; i < this.characters.length; i++ ) {
	    // No negation. At least one character must match.
	    var token = this.characters[i];
	    if( token.value == c ) {
		return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					       //0,  // read index 0 of input
					       1,   // 1 character matching
					       beginMark,
					       reader.getMark()
					     )
		       ];
	    } 
	} // END for
	// Loop terminated: character does not belong to normal set.
	//  -> no match at all
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       //0,  // read index 0 of input
				       0,   // 0 characters matched
				       beginMark,
				       reader.getMark()
				     )
	       ];
    }
};

IKRS.RegexCharacterSet.prototype.toString = function() {
    var str = "[";
    if( this.negate )
	str += "^";

    for( var i = 0; i < this.characters.length; i++ ) {
	if( this.characters[i].isEscaped )
	    str += this.characters[i].rawValue;
	else
	    str += this.characters[i].value;
    }

    str += "]";
    return str;
};


// Override name
IKRS.RegexCharacterSet.prototype.getName = function() {
    var str = "SET[";
    if( this.negate )
	str += "NOT ";

    for( var i = 0; i < this.characters.length; i++ ) {
	if( i > 0 )
	    str += " | ";
	if( this.characters[i].isEscaped )
	    str += this.characters[i].rawValue;
	else
	    str += this.characters[i].value;
    }

    str += "]";
    return str;
};


IKRS.RegexCharacterSet.prototype.constructor     = IKRS.RegexCharacterSet;

//IKRS.RegexCharacterSet.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexCharacterSet.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexCharacterSet.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexCharacterSet.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

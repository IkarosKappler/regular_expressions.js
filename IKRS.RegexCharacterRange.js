/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


/**
 * The start- and endSymbol params must be of type IKRS.RegexCharacter.
 **/
IKRS.RegexCharacterRange = function( negate,
				     startSymbol,
				     endSymbol
				   ) {

    IKRS.Pattern.call( this, "RANGE[" + ( negate ? "NOT " : "" ) + startSymbol.value + "-" + endSymbol.value + "]" );

    this.negate            = negate;
    this.startSymbol       = startSymbol;
    this.endSymbol         = endSymbol;    
};


IKRS.RegexCharacterRange.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // Read one character from the input
    var c     = reader.read();
    
    // EOI reached?
    if( c == -1 ) {

	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       //0,   // read index 0 if input
				       0,     // no characters matching
				       beginMark,
				       reader.getMark()
				     )
	       ];
    } else {
	
	var cCode = c.charCodeAt( 0 );
	if( !this.negate && this.startSymbol.getCharacterCode() <= cCode && cCode <= this.endSymbol.getCharacterCode() ) {

	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					   //0,  // read index
					   1,    // one character matching
					   beginMark,
					   reader.getMark()
					 )
		   ];
	    
	} else {

	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   //0,  // read index
					   0,    // no characters matching
					   beginMark,
					   reader.getMark()
					 )
		   ];

	}

    }

};

IKRS.RegexCharacterRange.prototype.toString = function() {
    var str = "[";

    if( this.negate )
	str += "^";

    //str += this.startSymbol.value + "-" + this.endSymbol.value;
    //str += this.startSymbol.tokenvalue + "-" + this.endSymbol.token.value;
    str += this.startSymbol.value + "-" + this.endSymbol.value;

    str += "]";
    return str;
};


IKRS.RegexCharacterRange.prototype.constructor     = IKRS.RegexCharacterRange;

IKRS.RegexCharacterRange.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexCharacterRange.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexCharacterRange.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexCharacterRange.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

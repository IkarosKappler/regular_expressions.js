/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConstant = function( tokenSequence ) {

    IKRS.Pattern.call( this, "CONSTANT[" + tokenSequence.toString() + "]" );

    this.tokenSequence = tokenSequence;
};

IKRS.RegexConstant.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // Try to read token by token from the reader
    for( var i = 0; i < this.tokenSequence.tokens.length; i++ ) {

	var token = this.tokenSequence.tokens[i];
	var c     = reader.read();
	
	if( c == -1 ) {
	    // EOI is no real character
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   //0,
					   i,    // length
					   beginMark,
					   reader.getMark()
					 )
		   ];
	} else if( c != token.value ) {
	    // Token does not match
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   //0,
					   i,    // length
					   beginMark,
					   reader.getMark()
					 )
		   ];
	    
	    
	} 
	// else: noop

    } // END for

    // All expected characters found.
    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
				   //0,
				   this.tokenSequence.tokens.length,   // matchLength
				   beginMark,
				   reader.getMark()
				 )
	   ];
    
};

IKRS.RegexConstant.prototype.toString = function() {
    //return "(" + this.charSequence + ")";
    return this.tokenSequence.toString();
};


IKRS.RegexConstant.prototype.constructor     = IKRS.RegexConstant;

IKRS.RegexConstant.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexConstant.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexConstant.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexConstant.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConcatenation = function( opt_left, opt_right ) {

    IKRS.Pattern.call( this, "CONCATENATION" );

    //this.left  = opt_left;
    //this.right = opt_right;
    
    // Add children to list by default
    if( opt_left != null )
	this.children.push( opt_left );

    if( opt_right != null )
	this.children.push( opt_right );
};

IKRS.RegexConcatenation.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // What's the concatenation of -empty-?
    if( this.children.length == 0 ) {

	// Hmmm ... equivalent to RegExp '()'
	// Does '()' match any input or none?
	// Btw. the parser does not produce such a Concatenation.
	return [];

    }
    

    var result    = [];
    var tmpResult = this.children[0].match( reader );
    //window.alert( "CONCATENATION leftest result: #" + tmpResult.length + ", values=" + tmpResult );
    for( var i = 1; i < this.children.length; i++ ) {

	result = this._matchRight( reader, beginMark, tmpResult, i );
	tmpResult = result;

    }


    return result;
};

IKRS.RegexConcatenation.prototype._matchRight = function( reader, beginMark, tmpResult, offset ) {

    var result = [];
    for( var e = 0; e < tmpResult.length; e++ ) {

	// Ignore incomplete/failed matches (if exist)?
	if( tmpResult[e].matchStatus != IKRS.MatchResult.STATUS_COMPLETE )
	    continue;
	
	
	// Set read position to end of current result
	reader.resetTo( tmpResult[e].endMark );
	
	
	var subResult = this.children[offset].match( reader );
	// Keep COMPLETE sub results in final result
	for( var f = 0; f < subResult.length; f++ ) {

	    if( subResult[f].matchStatus != IKRS.MatchResult.STATUS_COMPLETE ) 
		continue; // Ignore

	    result.push( new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					       subResult[f].endMark.position - beginMark.position,  // length
					       beginMark,
					       subResult[f].endMark
					     )
		       );
	    
	}

    }
    
    return result;
};


IKRS.RegexConcatenation.prototype.toString = function() {
    //return "(" + this.left.toString() + this.right.toString() + ")";
    var sb = new IKRS.StringBuffer();
    sb.append( "(" );
    for( var i = 0; i < this.children.length; i++ ) {
	sb.append( this.children[i].toString() );
    }	
    sb.append( ")" );
    return sb.toString();
};

IKRS.RegexConcatenation.prototype.addRegex = function( regex ) {
    this.children.push( regex );
};

IKRS.RegexConcatenation.prototype.constructor     = IKRS.RegexConcatenation;

IKRS.RegexConcatenation.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexConcatenation.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexConcatenation.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexConcatenation.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

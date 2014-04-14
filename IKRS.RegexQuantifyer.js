/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexQuantifyer = function( baseRegex,
				 minCount,
				 maxCount    // -1 indicates infinity
			       ) {

    IKRS.Pattern.call( this, "QUANTIFYER{"+minCount+","+maxCount+"}" );

    this.baseRegex = baseRegex;
    this.minCount  = minCount;
    this.maxCount  = maxCount;

    // For consistency
    this.children.push( baseRegex );
};

IKRS.RegexQuantifyer.prototype.match = function( reader ) {

    //window.alert( "baseRegex=" + this.baseRegex );

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    var i = 0;
    var c;
    var mark;
    // Check how many times the base pattern can be repeatedly matched.
    var result = [];
    


    var tmpResults = this.baseRegex.match( reader );

    // Empty expression allowed?    
    if( this.minCount == 0 ) {
	result.push( new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					    0,  // matchLength
					    beginMark,
					    beginMark  // Nothing read :)
					  ) );
    }

    while( i < tmpResults.length ) {

	// We are not interested in failed match tries here.
	if( tmpResults[i].matchStatus == IKRS.MatchResult.STATUS_COMPLETE  ) {
	    
	    // Inside quantifyer bounds?
	    if( (i+1) >= this.minCount && (i+1) <= this.maxCount ) {
		result.push( new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
						   tmpResults[i].endMark.position - beginMark.position,
						   beginMark,
						   tmpResults[i].endMark
						 ) );
	    }

	    
	    // Set the read position of the temp result's ending position
	    if( !reader.resetTo(tmpResults[i].endMark) )
		throw "[IKRS.RegexQuantifyer.match(...)] Failed to set read position to " + tmpResults[i].endMark.position + ".";


	    // Only continue if not yet EOI was reached
	    //if( !reader.reachedEOI() && reader.available() > 0 ) {

		// Try to re-match from the new position
		var subResults = this.baseRegex.match( reader );

		//window.alert( "[i=" +i +"] # of sub results: " + subResults.length + ", subResults=" + subResults );
		// And append for the next approaches
		//tmpResults.concat( subResults );
		//window.alert( "[IKRS.RegexQuantifyer.match(...)] tmpResults.length=" + tmpResults.length + ", subResults.length=" + subResults.length );
		for( var e = 0; e < subResults.length; e++ ) {
		    if( subResults[e].matchStatus == IKRS.MatchResult.STATUS_COMPLETE && subResults[e].matchLength > 0 ) {
			//window.alert( "Adding result [e=" + e + "] " + subResults[e] );
			tmpResults.push( subResults[e] );
		    }
		}
	    //}

	}

	i++;
    } // END while

    return result;
    
};

IKRS.RegexQuantifyer.prototype.toString = function() {

    if( this.maxCount == Number.POSITIVE_INFINITY ) {
	if( this.minCount == 0 )
	    return "(" + this.baseRegex.toString() + "*)";
	else if( this.minCount == 1 )
	    return "(" + this.baseRegex.toString() + "+)";
	else
	    return "(" + this.baseRegex.toString() + "{" + this.minCount + "})";
    } else if( this.maxCount != this.minCount ) { //this.maxCount == Number.POSITIVE_INFINITY ) {
	return "(" + this.baseRegex.toString() + "{" + this.minCount + ",})";
    } else {
	return "(" + this.baseRegex.toString() + "{" + this.minCount + "," + this.maxCount + "})";
    }
    
};


// @override ?
/*
IKRS.RegexQuantifyer.prototype.getChildren     = function() {
    return [ this.baseRegex ];
};
*/

IKRS.RegexQuantifyer.prototype.constructor     = IKRS.RegexQuantifyer;

IKRS.RegexQuantifyer.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexQuantifyer.prototype.getValue        = IKRS.Pattern.prototype.getValue
//IKRS.RegexQuantifyer.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexQuantifyer.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
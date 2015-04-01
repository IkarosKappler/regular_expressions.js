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


    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    var i = 0;
    var c;
    var mark;
    // Check how many times the base pattern can be repeatedly matched.
    //var result = [];

    // Note: with Kleene Stern Operators and partial/empty sub results the
    //       temp result set might become _extremely_ large, even though the
    //       final result is small. That's because EMPTY/PARTIAL might result
    //       from different sub expressions.
    // Example: ([a-c][d-f][g-i][j-l])*    and any alphabetical input.
    //          This has already four sub results with length 0 at the fist
    //          position.
    //          At the second position are again 4 empty sub result, makes up
    //          4*4 = 16 empty subresult at read position 1.
    //          At position 2 there are at least 64 results, at position 3 there
    //          are at least 256 results (plus the real non-empty results).
    //          An input string with 20 characters has at least 1.048.576
    //          sub results. That's not acceptable!
    // Solution: use a Set instead of an array and only add sub results that
    //           are really new.
    var uniqueResult = new IKRS.ArraySet( [], 
					  { equal: function(a,b) { 
					      return (a.matchStatus == b.matchStatus 
						      &&
						      a.beginMark.position && b.beginMark.position 
						      &&
						      a.matchLength == b.matchLength
						     )
					  } // END function
					  } // END object
					);


    var tmpResults = this.baseRegex.match( reader );

    // Empty expression allowed?    
    if( this.minCount == 0 ) {
	uniqueResult.addUnique( new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
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
		uniqueResult.addUnique( new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
							      tmpResults[i].endMark.position - beginMark.position,
							      beginMark,
							      tmpResults[i].endMark
							    ) );
	    }

	    
	    // Set the read position of the temp result's ending position
	    if( !reader.resetTo(tmpResults[i].endMark) )
		throw "[IKRS.RegexQuantifyer.match(...)] Failed to set read position to " + tmpResults[i].endMark.position + ".";

	    // Try to re-match from the new position
	    var subResults = this.baseRegex.match( reader );
	    for( var e = 0; e < subResults.length; e++ ) {
		if( subResults[e].matchStatus == IKRS.MatchResult.STATUS_COMPLETE && subResults[e].matchLength > 0 ) {
		    //window.alert( "Adding result [e=" + e + "] " + subResults[e] );
		    tmpResults.push( subResults[e] );
		}
	    }
	    

	}

	i++;
    } // END while

    return uniqueResult.elements; 
    
};

IKRS.RegexQuantifyer.prototype.toString = function() {

    if( this.maxCount == Number.POSITIVE_INFINITY ) {
	if( this.minCount == 0 )
	    return "(" + this.baseRegex.toString() + "*)";
	else if( this.minCount == 1 )
	    return "(" + this.baseRegex.toString() + "+)";
	else
	    return "(" + this.baseRegex.toString() + "{" + this.minCount + ",})";
    } else if( this.maxCount == this.minCount ) { //this.maxCount != Number.POSITIVE_INFINITY ) {
	return "(" + this.baseRegex.toString() + "{" + this.minCount + "})";
    } else {
	return "(" + this.baseRegex.toString() + "{" + this.minCount + "," + this.maxCount + "})";
    }
    
};



IKRS.RegexQuantifyer.prototype.constructor     = IKRS.RegexQuantifyer;

IKRS.RegexQuantifyer.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexQuantifyer.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexQuantifyer.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexQuantifyer.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

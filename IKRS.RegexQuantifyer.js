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

    var i = 0;
    var c;
    var mark;
    // Check how many times the base pattern can be repeatedly matched.
    while( !reader.reachedEOI() ) {

	var tmpResults = this.baseRegex.match( reader );

    }

    //return [];
    
};

IKRS.RegexQuantifyer.prototype.toString = function() {
    //return "(" + this.baseRegex.toString() + ")X";
    
    if( this.maxCount == -1 ) {
	if( this.minCount == 0 )
	    return "(" + this.baseRegex.toString() + "*)";
	else if( this.minCount == 1 )
	    return "(" + this.baseRegex.toString() + "+)";
	else
	    return "(" + this.baseRegex.toString() + "{" + this.minCount + "})";
    } else if( this.maxCount == Number.POSITIVE_INFINITY ) {
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
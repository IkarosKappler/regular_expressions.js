/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexKleene = function( baseRegex,
			     minCount,
			     maxCount    // -1 indicates infinity
			   ) {

    IKRS.Object.call( this );

    this.baseRegex = baseRegex;
    this.minCount  = minCount;
    this.maxCount  = maxCount;
};

IKRS.RegexKleene.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexKleene.prototype.toString = function() {
    if( this.maxCount == -1 ) {
	if( this.minCount == 0 )
	    return "(" + this.baseRegex.toString() + "*)";
	else if( this.minCount == 1 )
	    return "(" + this.baseRegex.toString() + "+)";
	else
	    return "(" + this.baseRegex.toString() + "{" + this.minCount + "})";
    } else {	
	return "(" + this.baseRegex.toString() + "{" + this.minCount + "," + this.maxCount + "})";
    }
};

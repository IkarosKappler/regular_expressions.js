/**
 * @author Ikaros Kappler
 * @date 2013-04-10
 * @version 1.0.0
 **/


IKRS.RegexIntersection = function( opt_left, opt_right ) {

    IKRS.Pattern.call( this, "INTERSECTION" );


    // children member inherited from IKRS.Pattern
    //this.children = [];

    if( opt_left != null ) 
	this.children.push( opt_left );
    if( opt_right != null ) 
	this.children.push( opt_right );
};

IKRS.RegexIntersection.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();


    if( this.children.length == 0 ) {

	return [];

    }



    // At least one child must match
    //  -> each mathing child belongs to the result set.
    var result = this.children[0].match( reader );
    if( result.length == 0 )
	return [];

    //window.alert( result );

    for( var i = 1; i < this.children.length; i++ ) {

	var tmpResult = [];

	reader.resetTo( beginMark );
	var subResult = this.children[i].match( reader );
	//window.alert( "subResult[" + i + "]=" + subResult );
	
	// Check for result/subresult intersection (must have same lengths!)
	for( var a = 0; a < result.length; a++ ) {

	    if( result[a].matchStatus != IKRS.MatchResult.STATUS_COMPLETE )
		continue;

	    for( var b = 0; b < subResult.length; b++ ) {

		if( subResult[b].matchStatus != IKRS.MatchResult.STATUS_COMPLETE )
		    continue;
		
		if( result[a].matchLength != subResult[b].matchLength )
		    continue;

		// Both match -> keep
		tmpResult.push( result[a] );

	    }

	}
	
	// Keep smaller intersection
	result = tmpResult;

    }
    
    return result;
};

IKRS.RegexIntersection.prototype.toString = function() {
    
    var str = "(";
    for( var i = 0; i < this.children.length; i++ ) {
	if( i > 0 )
	    str += "&&";
	str += this.children[i];
    }
    str += ")";
    
    //return "(" + this.left + "|" + this.right + ")";
    return str;
};


IKRS.RegexIntersection.prototype.constructor     = IKRS.RegexIntersection;

IKRS.RegexIntersection.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexIntersection.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexIntersection.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexIntersection.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

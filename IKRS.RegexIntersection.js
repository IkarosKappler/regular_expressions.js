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
    // ...
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

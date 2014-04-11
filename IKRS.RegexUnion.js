/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexUnion = function( opt_left, opt_right ) {

    IKRS.Pattern.call( this, "UNION" );


    // children member inherited from IKRS.Pattern
    //this.children = [];

    if( opt_left != null ) 
	this.children.push( opt_left );
    if( opt_right != null ) 
	this.children.push( opt_right );
};

/*
IKRS.RegexUnion.prototype.addChild = function( regex ) {
    this.children.push( regex );
};
*/

IKRS.RegexUnion.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexUnion.prototype.toString = function() {
    
    var str = "(";
    for( var i = 0; i < this.children.length; i++ ) {
	if( i > 0 )
	    str += "|";
	str += this.children[i].toString();
    }
    str += ")";
    
    //return "(" + this.left + "|" + this.right + ")";
    return str;
};


IKRS.RegexUnion.prototype.constructor     = IKRS.RegexUnion;

IKRS.RegexUnion.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexUnion.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexUnion.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexUnion.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

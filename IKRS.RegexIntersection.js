/**
 * @author Ikaros Kappler
 * @date 2013-04-10
 * @version 1.0.0
 **/


IKRS.RegexIntersection = function( opt_left, opt_right ) {

    IKRS.Object.call( this );


    this.children = [];
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
	    str += " && ";
	str += this.children[i];
    }
    str += ")";
    
    //return "(" + this.left + "|" + this.right + ")";
    return str;
};


IKRS.RegexIntersection.prototype.constructor = IKRS.RegexIntersection;
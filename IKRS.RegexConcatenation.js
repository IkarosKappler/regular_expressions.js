/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConcatenation = function( opt_left, opt_right ) {

    IKRS.Pattern.call( this, "CONCATENATION" );

    this.left  = opt_left;
    this.right = opt_right;
    
    // Add children to list by default
    if( opt_left != null )
	this.children.push( opt_left );

    if( opt_right != null )
	this.children.push( opt_right );
};

IKRS.RegexConcatenation.prototype.match = function( reader ) {
    // ...
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

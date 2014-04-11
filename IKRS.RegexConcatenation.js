/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConcatenation = function( left, right ) {

    IKRS.Pattern.call( this, "CONCATENATION" );

    this.left  = left;
    this.right = right;
    
    // Add childre to list by default
    this.children.push( left );
    this.children.push( right );
};

IKRS.RegexConcatenation.prototype.match = function( reader ) {
    // ...
};


IKRS.RegexConcatenation.prototype.toString = function() {
    return "(" + this.left.toString() + this.right.toString() + ")";
};

IKRS.RegexConcatenation.prototype.constructor     = IKRS.RegexConcatenation;

IKRS.RegexConcatenation.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexConcatenation.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexConcatenation.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexConcatenation.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

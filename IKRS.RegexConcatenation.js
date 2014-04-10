/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConcatenation = function( left, right ) {

    IKRS.Object.call( this );

    this.left  = left;
    this.right = right;
};

IKRS.RegexConcatenation.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexConcatenation.prototype.toString = function() {
    return "(" + this.left + this.right + ")";
}

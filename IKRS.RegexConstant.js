/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConstant = function( charSequence ) {

    IKRS.Object.call( this );

    this.charSequence = charSequence;
};

IKRS.RegexConstant.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexConstant.prototype.toString = function() {
    //return "(" + this.charSequence + ")";
    return this.charSequence;
};
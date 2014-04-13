/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConstant = function( tokenSequence ) {

    IKRS.Pattern.call( this, "CONSTANT[" + tokenSequence.toString() + "]" );

    this.tokenSequence = tokenSequence;
};

IKRS.RegexConstant.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexConstant.prototype.toString = function() {
    //return "(" + this.charSequence + ")";
    return this.tokenSequence.toString();
};


IKRS.RegexConstant.prototype.constructor     = IKRS.RegexConstant;

IKRS.RegexConstant.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexConstant.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexConstant.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexConstant.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

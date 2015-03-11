/**
 * @author Ikaros Kappler
 * @date 2014-04-16
 * @version 1.0.0
 **/


IKRS.RegexAttribute = function( value ) {

    IKRS.Object.call( this );

    this.value = value;

};

IKRS.RegexAttribute.prototype.isInteger = function( negativeAllowed ) {
    return IKRS.RegexToken.isInteger(this.value,negativeAllowed);
};

IKRS.RegexAttribute.prototype.isEmpty = function() {
    return (this.value == "");
};

IKRS.RegexAttribute.prototype.constructor = IKRS.RegexAttribute;
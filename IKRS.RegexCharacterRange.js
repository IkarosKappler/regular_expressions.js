/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


/**
 * The start- and endSymbol params must be of type IKRS.RegexCharacter.
 **/
IKRS.RegexCharacterRange = function( negate,
				     startSymbol,
				     endSymbol
				   ) {

    IKRS.Pattern.call( this, "RANGE[" + ( negate ? "NOT " : "" ) + startSymbol + "-" + endSymbol + "]" );

    this.negate            = negate;
    this.startSymbol       = startSymbol;
    this.endSymbol         = endSymbol;    
};


IKRS.RegexCharacterRange.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexCharacterRange.prototype.toString = function() {
    var str = "[";

    if( this.negate )
	str += "^";

    //str += this.startSymbol.value + "-" + this.endSymbol.value;
    //str += this.startSymbol.tokenvalue + "-" + this.endSymbol.token.value;
    str += this.startSymbol.toString() + "-" + this.endSymbol.toString();

    str += "]";
    return str;
};


IKRS.RegexCharacterRange.prototype.constructor     = IKRS.RegexCharacterRange;

IKRS.RegexCharacterRange.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexCharacterRange.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexCharacterRange.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexCharacterRange.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

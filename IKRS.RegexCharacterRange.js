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

    IKRS.Object.call( this );

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

    str += this.startSymbol.characterValue + "-" + this.endSymbol.characterValue;

    str += "]";
    return str;
};


IKRS.RegexCharacterRange.prototype.constructor = IKRS.RegexCharacterRange;
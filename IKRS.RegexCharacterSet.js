/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/

IKRS.RegexCharacterSet = function( negate ) {

    IKRS.Object.call( this );

    this.negate            = negate;
    this.characters        = [];
    
};

/**
 * The start- and endSymbol params must be of type IKRS.RegexCharacter.
 **/
IKRS.RegexCharacterSet.prototype.addCharacter = function( character ) {
    this.characters.push( character );
};

IKRS.RegexCharacterSet.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexCharacterSet.prototype.toString = function() {
    var str = "[";
    if( this.negate )
	str += "^";

    for( var i = 0; i < this.characters.length; i++ )
	str += this.characters[i];

    str += "]";
    return str;
};

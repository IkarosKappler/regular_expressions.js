/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/

IKRS.RegexCharacterSet = function( negate ) {

    IKRS.Pattern.call( this, "SET[...]" );

    this.negate            = negate;
    this.characters        = [];
    
};

/**
 * The start- and endSymbol params must be of type IKRS.RegexCharacter.
 **/
IKRS.RegexCharacterSet.prototype.addCharacter = function( character ) {
    this.characters.push( character );
    
    // Also add to children?
    //this.children.push( character );
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


// Override name
IKRS.RegexCharacterSet.prototype.getName = function() {
    var str = "SET[";
    if( this.negate )
	str += "NOT ";

    for( var i = 0; i < this.characters.length; i++ ) {
	if( i > 0 )
	    str += " | ";
	str += this.characters[i];
    }

    str += "]";
    return str;
};


IKRS.RegexCharacterSet.prototype.constructor     = IKRS.RegexCharacterSet;

//IKRS.RegexCharacterSet.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexCharacterSet.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexCharacterSet.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexCharacterSet.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;

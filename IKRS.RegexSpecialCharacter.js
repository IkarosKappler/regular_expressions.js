/**
 * @author Ikaros Kappler
 * @date 2014-04-12
 * @version 1.0.0
 **/


IKRS.RegexSpecialCharacter = function( token ) {

    IKRS.Pattern.call( this, "SPECIAL[" + token.value + "]" );


    this.token = token;
    
    // Also add to children list?
    //this.children.push( token );
};


IKRS.RegexSpecialCharacter.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexSpecialCharacter.prototype.toString = function() {
    
    if( this.token.isEscaped )
	this.token.rawValue;    // Eventually the *real* character value is not printable
    else
	return this.token.value;
    
    //return "X";
};


IKRS.RegexSpecialCharacter.prototype.constructor     = IKRS.RegexSpecialCharacter;

IKRS.RegexSpecialCharacter.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexSpecialCharacter.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexSpecialCharacter.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexSpecialCharacter.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
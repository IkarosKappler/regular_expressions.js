/**
 * @author Ikaros Kappler
 * @date 2014-04-10
 * @version 1.0.0
 **/


IKRS.RegexCharacter = function( characterValue,
				characterCode,
				rawValue
			      ) {

    IKRS.Object.call( this );

    this.characterValue = characterValue;
    this.characterCode  = characterCode;
    this.rawValue       = rawValue;
};


IKRS.RegexCharacter.prototype.match = function( reader ) {
    // ...
};

IKRS.RegexCharacter.prototype.toString = function() {
    return this.characterValue;
};


IKRS.RegexCharacter.prototype.constructor = IKRS.RegexCharacter;
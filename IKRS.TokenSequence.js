/**
 * @author Ikaros Kappler
 * @date 2014-04-10
 * @version 1.0.0
 **/

IKRS.TokenSequence = function() {

    IKRS.Object.call( this );

    this.tokens = [];
};

IKRS.TokenSequence.prototype.add = function( token ) {
    this.tokens.push( token );
};

IKRS.TokenSequence.prototype.toString = function() {
//    return this.tokens.join("");
    var sb = new IKRS.StringBuffer();
    for( var i = 0; i < this.tokens.length; i++ ) {
	sb.append( this.tokens[i].value );
    }
    return sb.toString();
};

IKRS.TokenSequence.prototype.constructor = IKRS.TokenSequence;
/**
 * @author Ikaros Kappler
 * @date 2014-04-09
 * @version 1.0.0
 **/


IKRS.StringBuffer = function( opt_initialString ) {

    Object.call( this );

    this.buffer = Array();
    this.length = 0;

    if( opt_initialString )
	this.append( opt_initialString );

};

IKRS.StringBuffer.prototype.getLength = function() {
    return this.length;
};

IKRS.StringBuffer.prototype.append = function( value ) {

    if( typeof value == "undefined" ) {
	
	return this.append( "undefined" );
    
    } else {

	var strValue = new String( value );
	this.buffer.push( value );
	this.length += strValue.length;

    }
};

IKRS.StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};


IKRS.StringBuffer.prototype.constructor = IKRS.StringBuffer;

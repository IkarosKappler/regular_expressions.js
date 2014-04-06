/**
 * @author Ikaros Kappler
 * @date 2014-04-06
 * @version 1.0.0
 **/


/**
 * 'stringData' must not be null.
 **/
IKRS.PushbackStringReader = function( stringData,
				      startOffset,
				      maxReadLength
				    ) {

    IKRS.Object.call();

    if( typeof startOffset == "undefined" )
	startOffset = 0;
    
    if( typeof maxReadLength == "undefined" )
	maxReadLength = stringData.length();



    this.stringData            = stringData;
    this.startOffset           = Math.max( 0, startOffset );
    this.maxReadLength         = Math.min( maxReadLength, stringData.length );
    
    this.position              = -1;  // Show at character BEFORE data begins
    this.currentCharacter      = -1;  // Indicates 'Not available'/EOI
    this.currentCharacterCode  = -1;  // Unicode number
    this.lineNumber            = 1;
    this.columnNumber          = 0;
};

IKRS.PushbackStringReader.prototype.getPosition = function() {
    return this.position;
};

IKRS.PushbackStringReader.prototype.getCurrentCharacter = function() {
    return this.currentCharacter;
};

IKRS.PushbackStringReader.prototype.getCurrentCharacterCode = function() {
    return this.currentCharacterCode;
};

IKRS.PushbackStringReader.prototype.getLineNumber = function() {
    return this.lineNumber;
};

IKRS.PushbackStringReader.prototype.getColumnNumber = function() {
    return this.columnNumber;
};


/**
 * Read the next character from the input or -1 if EOI is reached.
 **/
IKRS.PushbackStringReader.prototype.read = function() {

    // Read limit reached?
    if( this.startOffset + this.position + 1 >= this.startOffset + this.maxReadLength ) {

	this.currentCharacter     = -1;
	this.currentCharacterCode = -1;
	return -1;
    }
    
    // Switch to next char
    this.position++;

    this.currentCharacter     = this.stringData.charAt( this.position );
    this.currentCharacterCode = this.stringData.charCodeAt( this.position );

    // Line break?
    if( this.currentCharacter == '\n' || this.currentCharacterCode == 0x0A || this.currentCharacterCode == 0x0D ) {
	this.lineNumber++;
	this.columnNumber = 1;
    } else {
	this.columnNumber++;
    }
    
    return this.currentCharacter;
    
};

IKRS.PushbackStringReader.prototype.unread = function( n ) {

    // Unread 1 character by default
    if( typeof n == "undefined" || n == null )
	n = 1;

    if( this.position-n+1 < this.startOffset ) {
	console.log( "[IKRS.PushbackStringReader.unread(" + n + ")] Cannot unread " + n + " characters. Only " + this.position + " read so far." );
	return false;
    }

    var linesSkipped = false;
    while( n > 0 ) {

	var tmpChar     = this.stringData.charAt( this.position );
	var tmpCharCode = this.stringData.charCodeAt( this.position );

	if( tmpChar == '\n' || tmpCharCode == 0x0A || tmpCharCode == 0x0D ) {
	    this.lineNumber--;	    
	    linesSkipped = true;
	} else {
	    this.columnNumber--;
	}

	this.position--;
	n--;
    }

    if( linesSkipped ) 
	this.columnNumber = this.detectCurrentLineLength();

    if( this.position < 0 ) { // might be -1
	this.currentCharacter     = -1;
	this.currentCharacterCode = -1;
    } else {
	this.currentCharacter     = this.stringData.charAt( this.position );
	this.currentCharacterCode = this.stringData.charCodeAt( this.position );
    }

    return true;
};

IKRS.PushbackStringReader.prototype._detectCurrentLineLength = function() {

    var p  = this.position;
    var c  = -1;
    var cc = -1;
    do { 
	c  = this.stringData.charAt( p );
	cc = this.stringData.charCodeAt( p );

	p--;
    } while( p >= 0 && !this._isLineBreak(character,characterCode) );

    // How many character where skipped backwards?
    //  -> length of the current line
    return (this.position - p);
};

IKRS.PushbackStringReader.prototype._isLineBreak = function( character, characterCode ) {
    return ( character == '\n' || character == '\r' || characterCode == 0x0A || characterCode == 0x0D );
};


IKRS.PushbackStringReader.prototype.toString = function() {
    var shortString = this.stringData.substr(0,32);
    if( shortString.length < this.stringData.length )
	shortString += "[..." + (this.stringData.length()-shortString.length()) + " more char(s)...]";
    return "[IKRS.PushbackStringReader]={ stringData=" + shortString + ", startOffset=" + this.startOffset + ", maxReadLength=" + this.maxReadLength + " }";
};


IKRS.Object.prototype.contructor = IKRS.RegexToken;
/**
 * The PushbackStringReader maps read(), unread() and available() functions
 * onto strings. It also supports mark() and reset().
 *
 * Additionally it keeps track of the read position, read start and read
 * end.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-06
 * @version 1.0.0
 **/


/**
 * 'stringData' must not be null.
 * The parameters 'startOffset' and 'maxReadLength are optional and set to
 * 0 (zero) respective stringData.length if not passed. If they are passed
 * and out of bounds, the constructor will set them to propriate values.
 **/
IKRS.PushbackStringReader = function( stringData,
				      startOffset,
				      maxReadLength
				    ) {

    IKRS.Object.call();

    if( typeof startOffset == "undefined" )
	startOffset = 0;
    
    if( typeof maxReadLength == "undefined" )
	maxReadLength = stringData.length;



    this.stringData            = stringData;
    this.startOffset           = Math.max( 0, startOffset );
    this.maxReadLength         = Math.min( maxReadLength, stringData.length );
    
    this.position              = -1;  // Show at character BEFORE data begins
    this.currentCharacter      = -1;  // Indicates 'Not available'/EOI
    this.currentCharacterCode  = -1;  // Unicode number
    this.lineNumber            = 1;
    this.columnNumber          = 0;

    this._resetMark            = null;

    // Make an initial mark. This avoids that the _mark value can
    // reach an undefined state (it cannot be unset, only overwritten
    // with a new value).
    this.mark();
};

/**
 * Check whether this read has reached the end of input (EOI).
 * The read() function will return -1 if so.
 **/
IKRS.PushbackStringReader.prototype.reachedEOI = function() {
    return (this.position >= this.maxReadLength);
};

/**
 * Get the current read position (relative to startOffset!).
 **/
IKRS.PushbackStringReader.prototype.getPosition = function() {
    return this.position;
};

/**
 * The the current character from the read position. If EOI was reached
 * or read() was not called before the function returns -1.
 **/
IKRS.PushbackStringReader.prototype.getCurrentCharacter = function() {
    return this.currentCharacter;
};

/**
 * Get the current character's numeric code from the read position. If EOI
 * was reached or read() was not called before the functions returns -1.
 **/
IKRS.PushbackStringReader.prototype.getCurrentCharacterCode = function() {
    return this.currentCharacterCode;
};

/**
 * Get the current line number.
 * The first line's number is 1 (one).
 **/
IKRS.PushbackStringReader.prototype.getLineNumber = function() {
    return this.lineNumber;
};

/**
 * Get the current column number.
 * The first column's number is 0 (zero).
 **/
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

/**
 * Returns the number of bytes actually matching the given string.
 * Note that one character more than the returned value indicates was
 * read!
 *
 * This function is usually used in combination with a predeceding mark()
 * call to remember where the reader was.
 **/
/*
IKRS.PushbackStringReader.prototype.tryRead = function( expectedString ) {
    
    var charactersMatching = 0;
    while( this.read() != -1 && 
	   this.currentCharacter == expectedString.charAt(charactersMatching) ) {
	
	charactersMatching++;

    } 

    return charactersMatching;
};
*/

/**
 * Unreads n characters back to the stream so that they can be read again.
 * If n is bigger than the number of characters that were already read, the
 * function does nothing and returns false.
 *
 * On success the function returns true.
 **/
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

/**
 * Set a read mark at the current position.
 * A later reset() call will restore the read state from the mark.
 *
 * Note that this function returns a mark object which can be applied
 * to resetTo(...) at any time.
 **/
IKRS.PushbackStringReader.prototype.mark = function() {
    
    // Just store the settings inside n object
    this._resetMark = {
	position:             this.position,
	currentCharacter:     this.currentCharacter,
	currentCharacterCode: this.currentCharacterCode,
	lineNumber:           this.lineNumber,
	columnNumber:         this.columnNumber
    };
    
    return this._resetMark;
};


/**
 * Restore the read state from a previously set mark.
 * The initial mark is set to the begin of the input.
 **/
IKRS.PushbackStringReader.prototype.reset = function() {
    // Pre: this._resetMark cannot be undefined
    this._resetTo( this._resetMark );
};


/**
 * Restore the read state to the given mark. The mark object
 * must be structured as one returned by the mark() function.
 *
 * If any of the mark's parameters do not apply, the reader
 * is unchanged an the function returns false (true otherwise).
 **/
IKRS.PushbackStringReader.prototype.resetTo = function( mark ) {
    
    // Check the mark properties before applying them!
    if( mark.position < 1 || mark.position > this.maxReadLength )
	return false;

    this.position              = this._resetMark.position;
    
    if( this.position == this.startOffset-1 || mark.position > this.maxReadLength ) {
	this.currentCharacter     = -1;
	this.currentCharacterCode = -1;
    } else {
	this.currentCharacter     = this.stringData.charAt( this.startOffst + this.position );
	this.currentCharacterCode = this.stringData.charCodeAt( this.startOffst + this.position );
    }
    //this.currentCharacter      = this._resetMark.currentCharacter;
    //this.currentCharacterCode  = this._resetMark.currentCharacterCode;

    this.lineNumber            = this._resetMark.lineNumber;
    this.columnNumber          = this._resetMark.columnNumber;

};


/**
 * Returns the number of characters that are available to read.
 * The returned value is absolute and not a proximation.
 **/
IKRS.PushbackStringReader.prototype.available = function() {
    return this.maxReadLength-this.position;
};


/**
 * A private function that's used to restore the correct lineNumber-
 * and columnNumber values after unread() was performed.
 **/
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

/**
 * A private function that checks if the passed character/charCode pair represents
 * a line break (used to keep track of lineNumber and columnNumber).
 **/
IKRS.PushbackStringReader.prototype._isLineBreak = function( character, characterCode ) {
    return ( character == '\n' || character == '\r' || characterCode == 0x0A || characterCode == 0x0D );
};

/**
 * Make a string representation of the inner state of the reader.
 **/
IKRS.PushbackStringReader.prototype.toString = function() {
    var shortString = this.stringData.substr(0,32);
    if( shortString.length < this.stringData.length )
	shortString += "[..." + (this.stringData.length()-shortString.length()) + " more char(s)...]";
    return "[IKRS.PushbackStringReader]={ stringData=" + shortString + ", startOffset=" + this.startOffset + ", maxReadLength=" + this.maxReadLength + ", position=" + this.position + ", this.currentCharacter=" + this.currentCharacter + " }";
};



IKRS.PushbackStringReader.prototype.constructor = IKRS.PushbackStringReader;
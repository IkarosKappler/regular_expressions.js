/**
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @version 1.0.0
 **/


var IKRS = IKRS || { CREATOR: "Ikaros Kappler",
		     DATE: "2013-11-27"
		   };
/**
 * @author Ikaros Kappler
 * @date 2013-08-14
 * @version 1.0.0
 **/

IKRS.Object = function() {

    // NOOP

};

IKRS.Object.inherit = function() {

}

IKRS.Object.prototype = {

    constructor: IKRS.Object,

    toString: function() { 
	return "[IKRS.Object]";
    }
};/**
 * This is a simple Set implementation that uses an array as storage.
 *
 * Additionally it uses a comparator function that makes it configurable
 * for the Itentity operator.
 *
 * Note that the passed array (if not null) will _not_ be copied. This
 * allows In-Place operations for better runtime/peformance.
 *
 *
 * The comparator (if not null) must have and 'equal' function with two 
 * parameters, returning a boolean value indicating the parameters 
 * identity.
 * If null is passed the default '==' identity will be used.
 *
 * @author Ikaros Kappler
 * @date 2013-12-19
 * @version 1.0.0
 **/


IKRS.ArraySet = function( elements,
			  comparator
			) {

    IKRS.Object.call( this );

    if( elements == undefined )
	elements = [];
    if( comparator == undefined )
	comparator = { equal: function( a, b ) { return a==b; } };


    this.elements   = elements;
    this.comparator = comparator;
};


IKRS.ArraySet.prototype.add = function( e ) {
    this.elements.push( e );
};

IKRS.ArraySet.prototype.addUnique = function( e ) {
    for( var i in this.elements ) {
	if( this.comparator.equal(e, this.elements[i]) )
	    return false;
    }
    this.elements.push( e );
    return true;
};

IKRS.ArraySet.prototype.removeElementAt = function( index ) {
    delete this.elements[ index ];
};

/**
 * Locate the index of the passed element. If the element
 * cannot be found then -1 is returned.
 *
 * Note that if there are multiple copies if the passed
 * element inside this set then a random index of the
 * matching items is returned (not necesarily the first).
 **/
IKRS.ArraySet.prototype.indexOf = function( e ) {
    for( var i in this.elements ) {
	if( this.comparator.equal(e, this.elements[i]) )
	    return i;
    }
    return -1;
};


IKRS.ArraySet.prototype.constructor = IKRS.ArraySet;
/**
 * @author Ikaros Kappler
 * @date 2014-04-16
 * @version 1.0.0
 **/


IKRS.RegexAttribute = function( value ) {

    IKRS.Object.call( this );

    this.value = value;

};

IKRS.RegexAttribute.prototype.isInteger = function( negativeAllowed ) {
    return IKRS.RegexToken.isInteger(this.value,negativeAllowed);
};

IKRS.RegexAttribute.prototype.isEmpty = function() {
    return (this.value == "");
};

IKRS.RegexAttribute.prototype.constructor = IKRS.RegexAttribute;/**
 * The super class for all IKRS.Regex* classes.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-10
 * @version 1.0.0
 **/


IKRS.Pattern = function( name ) {

    IKRS.Object.call( this );
    
    this.name       = name;
    this.children   = [];
    this.value      = null;    // Leaf notes have values
    this.attributes = [];
};


IKRS.Pattern.prototype.getName = function() {
    return this.name;
};

IKRS.Pattern.prototype.getValue = function() {
    return this.value;
};

/*
IKRS.Pattern.prototype.getChildCount = function() {
    return this.children.length;
};

IKRS.Pattern.prototype.getChildAt = function( index ) {
    return this.children[ index ];
};
*/

IKRS.Pattern.prototype.getChildren = function() {
    return this.children;
};

IKRS.Pattern.prototype.getAttributes = function() {
    return this.attributes;
};

IKRS.Pattern.prototype.constructor = IKRS.Pattern;/**
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

IKRS.PushbackStringReader.prototype.atBeginOfInput = function() {
    return (this.position == -1)
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
    /*
    this._resetMark = {
	position:             this.position,
	currentCharacter:     this.currentCharacter,
	currentCharacterCode: this.currentCharacterCode,
	lineNumber:           this.lineNumber,
	columnNumber:         this.columnNumber
    };
    return this._resetMark;
    */
    
    this._resetMark = this.getMark();
    return this._resetMark;
};

/**
 * This function creates a new read mark without storing it inside
 * the reader. The mark() and reset() functions are not affected by
 * this.
 **/
IKRS.PushbackStringReader.prototype.getMark = function() {
    return {
	position:             this.position,
	currentCharacter:     this.currentCharacter,
	currentCharacterCode: this.currentCharacterCode,
	lineNumber:           this.lineNumber,
	columnNumber:         this.columnNumber
    };
};


/**
 * Restore the read state from a previously set mark.
 * The initial mark is set to the begin of the input.
 **/
IKRS.PushbackStringReader.prototype.reset = function() {
    // Pre: this._resetMark cannot be undefined
    this.resetTo( this._resetMark );
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
    if( mark.position < -1 || mark.position > this.maxReadLength )
	return false;

    this.position              = mark.position;
    
    if( this.position <= -1 || this.position >= this.maxReadLength ) {
	this.currentCharacter     = -1;
	this.currentCharacterCode = -1;
    } else {
	this.currentCharacter     = this.stringData.charAt( this.startOffst + this.position );
	this.currentCharacterCode = this.stringData.charCodeAt( this.startOffst + this.position );
    }
    //this.currentCharacter      = this.mark.currentCharacter;
    //this.currentCharacterCode  = this.mark.currentCharacterCode;

    this.lineNumber            = mark.lineNumber;
    this.columnNumber          = mark.columnNumber;

    return true;
};


/**
 * Returns the number of characters that are available to read.
 * The returned value is absolute and not a proximation.
 **/
IKRS.PushbackStringReader.prototype.available = function() {
    return this.maxReadLength-this.position-1; // Really -1!? ... hmmmm
};


/**
 * Extracts a substring from the underlying string, defined by the given begin- and 
* end mark. 
 *
 * This function is used by the final Analyzer to avoid reading sub strings character-by-
 * character, thus storing inside a stringbuffer.
 * The built-in substr function is much faster.
 **/  
IKRS.PushbackStringReader.prototype.extractFromString = function( beginMark, endMark ) {
    if( endMark.position - beginMark.position < 1 )
	return "";
    else
	return this.stringData.substring( beginMark.position+1, 
					  endMark.position+1 );
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



IKRS.PushbackStringReader.prototype.constructor = IKRS.PushbackStringReader;/**
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

/*
IKRS.StringBuffer.prototype.trim = function() {
    
};
*/

IKRS.StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};


IKRS.StringBuffer.prototype.constructor = IKRS.StringBuffer;
/**
 * A token class.
 *
 *
 * @author   Ikaros Kappler
 * @date     2014-04-06
 * @modified 2015-03-11 Ikaros Kappler (added recognition of the '?' operator for quantifying expressions)
 * @version  1.0.1
 **/


/**
 * Note: there is the '-' token.
 *       It can be an operator AND it can be a constant simultaneously - depending
 *       on the context.
 **/
IKRS.RegexToken = function( value, 			    
			    rawValue,
			    isOperator,
			    isConstant,
			    isEscaped,
			    
			    inputStartOffset,
			    inputEndOffset
			  ) {

    IKRS.Object.call();

    this.value            = value;
    this.rawValue         = rawValue;
    this.isOperator       = isOperator;
    this.isConstant       = isConstant;
    this.isEscaped        = isEscaped;
    
    this.inputStartOffset = inputStartOffset;
    this.inputEndOffset   = inputEndOffset;
};

IKRS.RegexToken.KLEENESTERN              = '*';     
IKRS.RegexToken.KLEENENOTEMPTY           = '+';
IKRS.RegexToken.OPENINGBRACKET           = '(';
IKRS.RegexToken.CLOSINGBRACKET           = ')';
IKRS.RegexToken.SETSTART                 = '[';
IKRS.RegexToken.SETEND                   = ']';
IKRS.RegexToken.RANGE                    = '-';
IKRS.RegexToken.INTERSECTION             = '&&';
IKRS.RegexToken.UNION                    = '|';
IKRS.RegexToken.EXCEPT                   = '^';   // Directly after '['
IKRS.RegexToken.BEGIN_OF_INPUT           = '^';   // Anywhere
IKRS.RegexToken.END_OF_INPUT             = '$';
IKRS.RegexToken.ANY_CHARACTER            = '.';
IKRS.RegexToken.QUANTIFYING_START        = '{';
IKRS.RegexToken.QUANTIFYING_END          = '}';
IKRS.RegexToken.QUANTIFYING_QUESTIONMARK = '?';



IKRS.RegexToken.prototype.getCharacterCode = function() {

    // This is for later matching. If this token's value has more than one character
    // then the first one is taken.
    if( this.value.length == 0 ) // This is much more secure.
	return -1; 
    else
	return this.value.charCodeAt(0);

};


IKRS.RegexToken.prototype.isQuantifyingOperator = function() {
    return ( this.isOperator && 
	     ( this.value == '*' || this.value == '+' || this.value == '{' || this.value == '}' || this.value == '?' )
	   );
};

IKRS.RegexToken.prototype.isSpecialCharacter = function() {
    return ( !this.isEscaped && 
	     ( this.value == "." || this.value == "^" || this.value == "$" )
	   ) || 
	(this.isEscaped &&
	 ( this.value == "d" || this.value == "D" || this.value == "s" || this.value == "S" || this.value == "w" || this.value == "W" )
	);
};

/**
 * Warning: begin-of-input and negation-in-set are ambigous and context dependent!
 **/
IKRS.RegexToken.prototype.isBeginOfInputCharacter = function() {
    return (!this.isEscaped && this.value == '^');
};

IKRS.RegexToken.prototype.isEndOfInputCharacter = function() {
    return (!this.isEscaped && this.value == '$');
};

IKRS.RegexToken.prototype.isWildcardCharacter = function() {
    return (!this.isEscaped && this.value == '.');
};

IKRS.RegexToken.prototype.isDigitClassCharacter = function() {
    return (this.isEscaped && this.value == 'd');
};

IKRS.RegexToken.prototype.isNonDigitClassCharacter = function() {
    return (this.isEscaped && this.value == 'D');
};

IKRS.RegexToken.prototype.isWhitespaceClassCharacter = function() {
    return (this.isEscaped && this.value == 's');
};

IKRS.RegexToken.prototype.isNonWhitespaceClassCharacter = function() {
    return (this.isEscaped && this.value == 'S');
};

IKRS.RegexToken.prototype.isWordClassCharacter = function() {
    return (this.isEscaped && this.value == 'w');
};

IKRS.RegexToken.prototype.isNonWordClassCharacter = function() {
    return (this.isEscaped && this.value == 'W');
};

IKRS.RegexToken.prototype.isUnionOperator = function() {
    return ( this.isOperator && this.value == '|' );
};

IKRS.RegexToken.prototype.isQuantifyingStartOperator = function() {
    return ( this.isOperator && this.value == '{' );
};

IKRS.RegexToken.prototype.isQuantifyingEndOperator = function() {
    return ( this.isOperator && this.value == '}' );
};

IKRS.RegexToken.prototype.isQuestionMarkOperator = function() {
    return ( this.isOperator && this.value == '?' );
};

IKRS.RegexToken.prototype.isSternOperator = function() {
    return ( this.isOperator && this.value == '*' );
};

IKRS.RegexToken.prototype.isPlusOperator = function() {
    return ( this.isOperator && this.value == '+' );
};

IKRS.RegexToken.prototype.isSetStartOperator = function() {
    return ( this.isOperator && this.value == '[' );
};

IKRS.RegexToken.prototype.isSetEndOperator = function() {
    return ( this.isOperator && this.value == ']' );
};

IKRS.RegexToken.prototype.isClosingBracketOperator = function() {
    return ( this.isOperator && this.value == ')' );
};

IKRS.RegexToken.prototype.isOpeningBracketOperator = function() {
    return ( this.isOperator && this.value == '(' );
};

IKRS.RegexToken.prototype.isRangeOperator = function() {
    return ( this.isOperator && this.value == '-' );
};

IKRS.RegexToken.prototype.isAndOperator = function() {
    return ( this.isOperator && this.value == "&&" );
};

IKRS.RegexToken.prototype.isWhitespace = function() {
    return (!this.isEscaped && (this.value == " " || this.value == "\n" || this.value == "\t" || this.value == '\b' || this.value == '\f'));
};

/**
 * Warning: begin-of-input and negation-in-set are ambigous and context dependent!
 **/
IKRS.RegexToken.prototype.isExceptOperator = function() {
    return ( this.isOperator && this.value == "^" );
};

IKRS.RegexToken.isInteger = function( value, negativeAllowed ) {
    if( value == null || value.length == 0 )
	return false;

    for( var i = 0; i < value.length; i++ ) {

	if( i == 0 && value.charAt(i) == '-' && !negativeAllowed )
	    return false;

	if( (i != 0 || value.charAt(i) != '-') && !IKRS.RegexToken.isDecimalDigitCharacter(value.charAt(i)) )
	    return false;

    }
    return true;
};

IKRS.RegexToken.isHexadecimal = function( value ) {
    for( var i = 0; i < value.length; i++ ) {

	if( !IKRS.RegexToken.isHexadecimalCharacter(value.charAt(i)) )
	    return false;

    }
    return true;
};

IKRS.RegexToken.isOctal = function( value ) {
    for( var i = 0; i < value.length; i++ ) {

	if( !IKRS.RegexToken.isOctalCharacter(value.charAt(i)) )
	    return false;

    }
    return true;
};

/**
 * If this is set the symbol has a special
 * meaning:<br>
 * <li>.         Any character (may or may not match line terminators)</li>
 * <li>\d        A digit: [0-9]</li>
 * <li>\D        A non-digit: [^0-9]</li>
 * <li>\s        A whitespace character: [ \t\n\x0B\f\r]</li>
 * <li>\S        A non-whitespace character: [^\s]</li>
 * <li>\w        A word character: [a-zA-Z_0-9] </li>
 * <li>\W        A non-word character: [^\w]</li>
 **/

IKRS.RegexToken.prototype.toString = function() {
    return "[IKRS.RegexToken]={ value=" + this.value + ", rawValue=" + this.rawValue + ", isOperator=" + this.isOperator + ", isConstant=" + this.isConstant + ", isEscaped=" + this.isEscaped + ", inputStart=" + this.inputStartOffset + ", inputEnd=" + this.inputEndOffset + " }";
};

/**
 * Checks whether the passed character (string with length 1) is a decimal
 * digit.
 **/
IKRS.RegexToken.isDecimalDigitCharacter = function( character ) {

    return ( character == "0" ||
	     character == "1" ||
	     character == "2" ||
	     character == "3" ||
	     character == "4" ||
	     character == "5" ||
	     character == "6" ||
	     character == "7" ||
	     character == "8" ||
	     character == "9" 
	   );

};

/**
 * Checks whether the passed character (string with length 1) is n octal
 * digit.
 **/
IKRS.RegexToken.isOctalDigitCharacter = function( character ) {

    return ( character == "0" ||
	     character == "1" ||
	     character == "2" ||
	     character == "3" ||
	     character == "4" ||
	     character == "5" ||
	     character == "6" ||
	     character == "7" 
	   );

};

IKRS.RegexToken.isHexadecimalCharacter = function( character ) {

    return ( IKRS.RegexToken.isDecimalDigitCharacter( character ) ||
	     character == "A" ||
	     character == "a" ||
	     character == "B" ||
	     character == "b" ||
	     character == "C" ||
	     character == "c" ||
	     character == "D" ||
	     character == "d" ||
	     character == "E" ||
	     character == "e" ||
	     character == "F" ||
	     character == "f" 
	   );

};


IKRS.Object.prototype.contructor = IKRS.RegexToken;
/**
 * The RegexTokenizer reads from the passed underlying pushbackreader. It splits
 * the input into a sequence of tokens from the regular-expressions grammar.
 *
 * Each processed token gets a set of flags, such as isOperator or isEscaped.
 * The most recent token will be stored in this.currentToken.
 *
 *
 * Example input:
 *  a|[0-9]
 *
 * Resulting token sequence:
 *  - { value: a, isOperator: false, ... }
 *  - { value: |, isOperator: true, ... }
 *  - { value: [, isOperator: true, ... }
 *  - { value: 0, isOperator: false, ... }
 *  - { value: -, isOperator: true, ... }
 *  - { value: 9, isOperator: false, ... }
 *  - { value: ], isOperator: true, ... }
 *  - null (indicates EOI)
 *
 *
 * Note the the tokenizer skips whitespace, so no whitespace tokens can be
 * returned.
 *
 *
 * @author  Ikaros Kappler
 * @date     2014-05-08
 * @modified 2015-03-11 Ikaros Kappler (Added the '?' operator, which is a variant of {m,n})
 * @version  1.0.1
 **/


/**
 * The constructor expects an IKRS.PushbackReader to be passed. All tokens
 * will be read from that reader.
 **/
IKRS.RegexTokenizer = function( pushbackReader ) {

    IKRS.Object.call( this );
    
    this.pushbackReader = pushbackReader;
    this.currentToken   = null;
    this.peekToken      = null;  // The next token after current token
    this.firstCall      = true;
};

/**
 * A private function to set and return the new token value
 * with one function call.
 **/
IKRS.RegexTokenizer.prototype._setCurrentToken = function( token ) {
    //this.currentToken = token;
    this.currentToken = this.peekToken;
    this.peekToken    = token;
    return this.currentToken; // token;
    //return token;
};

/**
 * Test if the underlying reader reched EOI.
 * No more token can be read then and the nextToken() call
 * will return null.
 **/
IKRS.RegexTokenizer.prototype.reachedEOI = function() {
    return (this.currentToken == null);
};

IKRS.RegexTokenizer.prototype.peek = function() {
    return this.peekToken;
};

/**
 * Get the next token from the reader.
 * If EOI is reached the function returns null.
 **/
IKRS.RegexTokenizer.prototype.nextToken = function() {
    
    if( this.firstCall ) {
	// Init the peek token.
	this.firstCall = false;
	this.nextToken();
    }

    // Skip whitespace tokens
    do {
	
	this._nextTokenWhitespaceAllowed();
	
    } while( !this.reachedEOI() && this.currentToken.isWhitespace() );
    return this.currentToken;
};

/**
 * A private function to read _any_ next token, including whitespace.
 **/
IKRS.RegexTokenizer.prototype._nextTokenWhitespaceAllowed = function() {

    var c0 = this.pushbackReader.read();
    if( c0 == -1 )
	return this._setCurrentToken( null );

    
    if( c0 == '\\' ) {

	return this._readEscaped( c0 );

    } else if( c0 == '*' || c0 == '+' || c0 == '(' || c0 == ')' || 
	       c0 == '[' || c0 ==  ']' || c0 == '|' || 
	       c0 == '{' || c0 == '}' || c0 == '?'
	     ) {

	// value, rawValue, is operator, no constant, not escaped
	return this._setCurrentToken( new IKRS.RegexToken( c0, c0, true, false, false, this.pushbackReader.position, this.pushbackReader.position+1 ) );   

    } else if( c0 == '-' || c0 == '^' ) {

	// value, rawValue, is operator AND is a constant, not escaped
	return this._setCurrentToken( new IKRS.RegexToken( c0, c0, true, true, false, this.pushbackReader.position, this.pushbackReader.position+1 ) );    

    } else if( c0 == '-' || c0 == '$' ) {

	// value, rawValue, no operator, is a constant, not escaped
	return this._setCurrentToken( new IKRS.RegexToken( c0, c0, false, true, false, this.pushbackReader.position, this.pushbackReader.position+1 ) );   

    } else if( c0 == '&' ) {
	
	// Only double-& is an operator
	var c1 = this.pushbackReader.read();
	if( c1 == '&' ) {
	    // value, rawValue, is operator, no constant, not escaped
	    return this._setCurrentToken( new IKRS.RegexToken("&&","&&",true,false, false, this.pushbackReader.position-1, this.pushbackReader.position+1 ) ); 
	} else {
	    if( c1 != -1 )
		this.pushbackReader.unread(1); // Unread the next token!
	    // value, rawValue, no operator, is constant, not escaped
	    return this._setCurrentToken( new IKRS.RegexToken(c0, c0, false, true, false, this.pushbackReader.position, this.pushbackReader.position+1 ) );  
	}
	    

    } else {

	//window.alert( "c=" + c0 + ", position=" + this.pushbackReader.position );

	// value, rawValue, no operator, is constant, not escaped
	return this._setCurrentToken( new IKRS.RegexToken( c0, c0, false, true, false, this.pushbackReader.position, this.pushbackReader.position+1 ) );    

    }

};

/**
 * A private function to read escaped input; this implies that the '\' character
 * was already read.
 *
 * c0 contains the first character; usually this is '\' (a backslash).
 *
 *
 * Supported escape characters:
 * \\       The backslash character
 * \0n      The character with octal value 0n (0 <= n <= 7)
 * \0nn     The character with octal value 0nn (0 <= n <= 7)
 * \0mnn    The character with octal value 0mnn (0 <= m <= 3, 0 <= n <= 7)
 * \xhh     The character with hexadecimal value 0xhh
 * \uhhhh   The character with hexadecimal value 0xhhhh
 * \t       The tab character ('\u0009')
 * \n       The newline (line feed) character \u000A
 * \r       The carriage-return character \u000D
 * \f       The form-feed character ('\u000C')
 * \a       The alert (bell) character ('\u0007')
 * \e       The escape character ('\u001B')
 *
 **/
IKRS.RegexTokenizer.prototype._readEscaped = function( c0 ) {
    
    var c1            = this.pushbackReader.read();
    if( c1 == -1 )
	this._throwParseException( "EOI reached where escaped symbol is expected." );
    
    if( c1 == '\\' ) {

	// Escaped Backslash Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( c1, c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );  

    } else if( c1 == 't' ) {
	
	// Tabulator Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( '\t', c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );  

    } else if( c1 == 'n' ) {

	// Line Break Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( '\n', c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );

    } else if( c1 == 'b' ) {

	// Line Break Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( '\b', c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );

    } else if( c1 == 'f' ) {

	// Line Break Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( '\f', c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );

    } else if( c1 == 'r' ) {

	// Carriage Return Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( '\r', c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );

    } else if( c1 == 'f' ) {

	// Form Feed Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( '\f', c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );	

    } else if( c1 == 'a' ) {

	// Alert Bell Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( '\a', c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );

    } else if( c1 == 'e' ) {

	// Escape Character
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( '\e', c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );

    } else if( c1 == 'x' ) {

	return this._readEscapedASCIIChar( c0+c1 );

    } else if( c1 == 'u' ) {

	return this._readEscapedUnicodeChar( c0+c1 );

    } else if( c1 == '0' ) {

	return this._readEscapedOctalChar( c0+c1 );

    } else {
	
	// A plain escaped character.
	// Usually ... only operators and special chars are allowed to be escaped.
	// ... check for operator chars? ...
	// Idea: check later in Parser to keep the tokenizer more flexible?
	
	//if( c1 != '.' && c1 != '^' && c1 != '$' && c1 != '*' && c1 != '+' && c1 != '(' && c1 == ')' && 
	//    c1 == '[' && c1 ==  ']' && c1 == '|' && c1 != '-'
	//    c1 == '{' && c1 == '}' 

	//window.alert( "c=" + c1 + ", position=" + this.pushbackReader.position );
	
	// value, rawValue, no operator, is constant, IS escaped!
	return this._setCurrentToken( new IKRS.RegexToken( c1, c0+c1, false, true, true, this.pushbackReader.position-1, this.pushbackReader.position+1 ) );

    }
};

/**
 * A private function that reads escaped ASCII characters of the form '\x..'.
 **/
IKRS.RegexTokenizer.prototype._readEscapedASCIIChar = function( prefix ) {

    // Read two hexadezimal characters
    if( this.pushbackReader.available() < 2 ) {
	this._setCurrentToken( null );
	this._throwParseException( "ASCII character code expected. Found EOI." );
    }

    var cA        = this.pushbackReader.read();
    var cB        = this.pushbackReader.read();
    var hexCode   = cA + cB;
    if( !IKRS.RegexToken.isHexadecimal(hexCode) ) {
	this._throwParseException( "Not a valid ASCII number: '" + hexCode + "'" );
    }
    
    var number    = parseInt(hexCode,16);
    var character = String.fromCharCode( number );

    // value, rawValue, no operator, is constant, IS escaped!
    return this._setCurrentToken( new IKRS.RegexToken( character, prefix+code, false, true, true, this.pushbackReader.position-3, this.pushbackReader.position+1 ) );

};

/**
 * A private function that reads escaped Unicode characters of the form '\u....'.
 **/
IKRS.RegexTokenizer.prototype._readEscapedUnicodeChar = function( prefix ) {

    // Read two hexadezimal characters
    if( this.pushbackReader.available() < 4 ) {
	this._setCurrentToken( null );
	this._throwParseException( "Unicode character code expected. Found EOI." );
    }

    var cA        = this.pushbackReader.read();
    var cB        = this.pushbackReader.read();
    var cC        = this.pushbackReader.read();
    var cD        = this.pushbackReader.read();
    var hexCode   = cA + cB + cC + cD;
    if( !IKRS.RegexToken.isHexadecimal(hexCode) )  
	this._throwParseException( "Not a valid unicode number: '" + hexCode + "'" );
    
    var number    = parseInt(hexCode,16);
    var character = String.fromCharCode( number );

    // value, rawValue, no operator, is constant, IS escaped!
    return this._setCurrentToken( new IKRS.RegexToken( character, prefix+hexCode, false, true, true, this.pushbackReader.position-5, this.pushbackReader.position+1 ) );
};

/**
 * A private function that reads escaped Unicode characters of the form '\0...'.
 **/
IKRS.RegexTokenizer.prototype._readEscapedOctalChar = function( prefix ) {

    // Read two hexadezimal characters
    if( this.pushbackReader.available() < 3 ) {
	this._setCurrentToken( null );
	this._throwParseException( "Octal character code expected. Found EOI.");
    }


    var cA        = this.pushbackReader.read();
    var cB        = this.pushbackReader.read();
    var cC        = this.pushbackReader.read();
      var octalCode = cA + cB + cC;

    // The first digit must not be larger than 3
    if( cA != '0' && cA != '1' && cA != '2' && cA != '3' )
	this._throwParseException( "Not a valid octal number: '" + octalCode + "'" );				   
  
    if( !IKRS.RegexToken.isOctal(cB) || !IKRS.RegexToken.isOctal(cC) )  
	this._throwParseException( "Not a valid octal number: '" + octalCode + "'" );
    
    var number    = parseInt(hexCode,8);
    var character = String.fromCharCode( number );

    // value, rawValue, no operator, is constant, IS escaped!
    return this._setCurrentToken( new IKRS.RegexToken( character, prefix+code, false, true, true, this.pushbackReader.position-4, this.pushbackReader.position+1 ) );
}

IKRS.RegexTokenizer.prototype._throwParseException = function( errmsg ) {
    throw new IKRS.ParseException( errmsg,
				   this.pushbackReader.position,
				   this.pushbackReader.position+1
				 );
};

IKRS.RegexTokenizer.prototype.constructor = IKRS.RegexParser;
/**
 * Inspired by
 *   http://matt.might.net/articles/parsing-regex-with-recursive-descent/
 * Thanks to @mattmight
 *
 * @author Ikaros Kappler
 * @date 2014-05-09
 * @version 1.0.0
 **/



IKRS.RegexParser = function( tokenizer ) {

    IKRS.Object.call( this );
    
    this.tokenizer       = tokenizer;    
    this.warnings        = [];
};

/**
 * Start the parsing process.
 *
 * The input is read from the tokenizer that was passed to the 
 * constructor.
 *
 * The returned object is a Regular Expression, an instance of a sub class
 * of IKRS.Pattern.
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype.parse = function() {
    // Clear warnings from last run
    this.warnings        = [];

    // So read the first one.
    this.tokenizer.nextToken();

    // Then parse the first regex.
    return this.regex();
};

/**
 * Reads a regex from the current position of the input.
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype.regex = function() {

    var term = this.term();
    
    if( this.tokenizer.currentToken != null && 
	this.tokenizer.currentToken.isUnionOperator() 
      ) {
	this.tokenizer.nextToken();
	var regex = this.regex();
	return new IKRS.RegexUnion( term, regex );
    } else {
	return term;
    }
};


/**
 * Reads a term expression from the current position of the input. 
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype.term = function() {

    var factor = null;

    while( this.tokenizer.currentToken != null && 
	   !this.tokenizer.currentToken.isClosingBracketOperator() &&
	   !this.tokenizer.currentToken.isSetEndOperator() &&
	   !this.tokenizer.currentToken.isUnionOperator() 
	 ) {

	var nextFactor = this.factor();
	if( factor != null )
	    factor = new IKRS.RegexConcatenation( factor, nextFactor );
	else
	    factor = nextFactor;

    }
    
    return factor;
    
};


/**
 * Reads a factor expression from the current position of the input. 
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype.factor = function() {
    var base = this.base();

    while( this.tokenizer.currentToken != null && 
	   this.tokenizer.currentToken.isQuantifyingOperator() 
	   ) {
	
	base = this._readQuantifyingRule( base ); 
	// Consume '*', '+' or '}'
	this.tokenizer.nextToken();
	
    }
    
    return base;
};


/**
 * Reads a base expression from the current position of the input. 
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype.base = function() {
    
    if( this.tokenizer.currentToken.isOpeningBracketOperator() ) {
	
	// Next token might be '?'
	if( this.tokenizer.peek() != null &&
	    !this.tokenizer.peek().isEscaped &&
	    this.tokenizer.peek().value == '?' ) {

	    // TODO:
	    // THIS WOULD BE THE POINT TO IMPLEMENT THE PARSING OF GROUPING AND CAPTURING EXPRESSIONS.
	    // ...
	    this.warnings.push( "Capturing expressions ('?') not implemented. Handling as character expression." );
	}

	// Consume '('
	this.tokenizer.nextToken();
	var regex = this.regex();
	// Consume ')'
	this.tokenizer.nextToken();
	return regex;
    } else if( this.tokenizer.currentToken.isSetStartOperator() ) {

	var charSet = this._readCharacterSet( false );  // No initial negation
	// Consume ']'
	this.tokenizer.nextToken();
	return charSet;

    } else if( this.tokenizer.currentToken.isSpecialCharacter() ) {
	
	var regexSpecial = IKRS.RegexSpecialCharacter.createFromToken(this.tokenizer.currentToken); 
	// Consume special character
	this.tokenizer.nextToken();
	return regexSpecial;

    } else if( this.tokenizer.peek() != null &&
	       this.tokenizer.peek().isQuantifyingOperator() 
	     ) {

	var regex;
	if( this.tokenizer.currentToken.isSpecialCharacter() )
	    regex = IKRS.RegexSpecialCharacter.createFromToken(this.tokenizer.currentToken); 
	else
	    regex = new IKRS.RegexCharacter(this.tokenizer.currentToken);
	
	// Switch to quantifyer
	this.tokenizer.nextToken();
	return regex;

    } else {
	
	// New version: balanced concatenation tree
	var charSequence = new IKRS.TokenSequence();
	var concatRegex  = new IKRS.RegexConcatenation();
	while( (this.tokenizer.peek() == null ||
		!this.tokenizer.peek().isQuantifyingOperator()
	       ) &&
	       this.tokenizer.currentToken != null &&
	       !this.tokenizer.currentToken.isOperator 
	     ) {
	
	    if( this.tokenizer.currentToken.isSpecialCharacter() ) {

		if( charSequence.tokens.length == 1 )
		    concatRegex.addRegex( new IKRS.RegexCharacter(charSequence.tokens[0]) );
		else if( charSequence.tokens.length > 1 )
		    concatRegex.addRegex( new IKRS.RegexConstant(charSequence) );
		
		charSequence = new IKRS.TokenSequence();
		
		concatRegex.addRegex( IKRS.RegexSpecialCharacter.createFromToken(this.tokenizer.currentToken) ); 

	    } else {

		charSequence.add( this.tokenizer.currentToken );
		
	    }
	    
	    this.tokenizer.nextToken();
	} // END while

	
	// Sequence still has characters?
	if( charSequence.tokens.length > 0 )
	    concatRegex.addRegex( new IKRS.RegexConstant(charSequence) );

	// How many?
	if( concatRegex.children.length == 1 )
	    return concatRegex.children[0];
	else
	    return concatRegex;

    } // END if [isSpecialCharacter()]
    
};

/**
 * Precondition: current token is '*' (or '+' or '{' or '?') and there is a predecendent
 *               regex in the buffer.
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype._readQuantifyingRule = function( baseRegex ) {

    var minCount         = 0;
    var maxCount         = Number.POSITIVE_INFINITY;
    var knownAttributes  = 0;
    
    if( this.tokenizer.currentToken.isSternOperator() ) {
	maxCount = Number.POSITIVE_INFINITY;
    } else if( this.tokenizer.currentToken.isPlusOperator() ) {
	minCount = 1;
    } else if( this.tokenizer.currentToken.isQuestionMarkOperator() ) {
	minCount = 0;
	maxCount = 1;
    } else if( this.tokenizer.currentToken.isQuantifyingStartOperator() ) {

	// Thill will consume the whole '{' ... '}' section and store all elements
	// inside the current Regex's attribute list.
	this.__readAttributeList( baseRegex );

	// Check first two attributes (if present)
	if( baseRegex.attributes.length > 0 && 
	    baseRegex.attributes[0].isInteger(true)  // negative number syntactically allowed, however
	    // IKRS.RegexToken.isInteger(baseRegex.attributes[0],true)  // negative number syntactically allowed, however
	  ) {
	    
	    knownAttributes = 1;
	    minCount = parseInt(baseRegex.attributes[0].value);
	    if( minCount < 0 )
		this.warnings.push( "minCount " + minCount + " is negative." );
	    // Is the second attribute present?
	    if( baseRegex.attributes.length > 1 ) {
		//if( IKRS.RegexToken.isInteger(baseRegex.attributes[1],true) ) {
		if( baseRegex.attributes[1].isInteger(true) ) {
		    knownAttributes = 2;
		    maxCount = parseInt(baseRegex.attributes[1].value);
		    if( maxCount < minCount )
			this.warnings.push( "Maxcount " + maxCount + " is smaller than minCount " + minCount + "." );
		} else {
		    maxCount = Number.POSITIVE_INFINITY; 
		}
	    } else {
		// EXACTLY n times: maxCount == minCount
		maxCount = minCount;
	    }

	}

	// More quantifying rules are currently not implemented
	for( var i = knownAttributes; i < baseRegex.attributes.length; i++ ) {
	    
	    if( baseRegex.attributes[i].isEmpty() )
		this.warnings.push( "Quantifyer arrtibute at index " + i + " not supported." );
	    else 
		this.warnings.push( "Quantifyer arrtibute at index " + i + " not supported: '" + baseRegex.attributes[i].value + "'." );
	    
	}

    

    } else {
	this._throwParseException( "Unexpected operator at quantifyer start: '" + this.tokenizer.currentToken.value + "'." );
    }





    var newRegex  = null;
    if( minCount == 1 && maxCount == 1 ) {
	// Exactly one time the regex is the regex itself.
	//  -> no actual change
	newRegex = baseRegex; //lastRegex;
    } else {
	newRegex = new IKRS.RegexQuantifyer( baseRegex, // lastRegex, 
					     minCount,  // (notEmpty ? 1 : 0),  // At least once?
					     maxCount   // -1                   // No upper bound
					   );
    }

    return newRegex;
};


/**
 * Precondition: current token is '['.
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype._readCharacterSet = function( p_negate ) {
    
    // Safety check for recursive calls :)
    if( this.tokenizer.reachedEOI() )
	this._throwParseException( "Cannot read character set. Operator '[' expected, found instead: EOI." );
    if( !this.tokenizer.currentToken.isSetStartOperator() )
	this._throwParseException( "Cannot read character set. Operator '[' expected, found instead: '" + this.tokenizer.currentToken.value + "'." );




    // Each range must consist of at least three characters:
    //  - start character
    //  - range symbol '-'
    //  - end character
    
    var i                    = 0;
    var negate               = p_negate; 
    var        t0            = this.tokenizer.nextToken();
    if( t0 == null ) 
	this._throwParseException( "EOI reached but character set definition expected." );
    if( t0.isExceptOperator() ) {
	negate = !negate; 
	t0     = this.tokenizer.nextToken();
    }
    var t1                   = null;
    var characters           = [];
    var ranges               = [];
    var parentUnion          = new IKRS.RegexUnion( null, null );
    var optionalIntersection = null;         // Will be initialized when '&&' is read
    var endOfSetReached      = false;
    while( optionalIntersection == null  &&  // intersections are nested, so only one is allowed
	   !endOfSetReached &&
	   (t1 = this.tokenizer.nextToken()) != null && 
	   (t0 == null || !t0.isSetEndOperator())
	 ) {
   
	if( t0 == null ) {
	    
	    // First loop run: NOOP depending on t0
	    

	} else if( t0.isOperator ) { 

	    // The negation is only allowed at the first position, which was 
	    // already read BEFORE the loop.
	    // Other operators arent fine allowed here, too.
	    this._throwParseException( "Operator '" + t0.value + "' not allowed here." );



	} else if( t1.isRangeOperator() ) { 
	    // - t1 is the range operator '-'
	    // - t0 is a character
	    // - t2 must be present and also a character!
	    var t2 = this.tokenizer.nextToken();

	    if( t2 == null )
		this._throwParseException( "Unexpected EOI after range operator '" + t1.value + "'." );

	    if( t2.isOperator )
		this._throwParseException( "Constant value expected after range operator '" + t1.value + "'. Found instead '" + t2.value +"' (operator)." );
	    
	    // Check for special characters?	    
	    if( t0.isSpecialCharacter() )  // ^, $ or .
		throw new IKRS.ParseException( "Special character '" + t0.value + "' not allowed in ranges.", t0.inputStartOffset, t0.inputEndOffset );

	    if( t1.isSpecialCharacter() )  // ^, $ or .
		throw new IKRS.ParseException( "Special character '" + t1.value + "' not allowed in ranges.", t0.inputStartOffset, t0.inputEndOffset );
	    

	    var tmpRange = new IKRS.RegexCharacterRange( negate,
						         t0, // new IKRS.RegexCharacter(t0), //t0.value, t0.characterCode, t0.rawValue),
							 t2  // new IKRS.RegexCharacter(t2)  //t2.value, t2.characterCode, t2.rawValue)
						       );
	    ranges.push( tmpRange );
	    parentUnion.children.push( tmpRange );

	    // Skip operator in next turn!
	    t1 = this.tokenizer.nextToken();


	} else { //if( t0 != null ) {
	    
	    // t1 is no operator 
	    //  -> will be the next t0 constant in a regular loop turn.

	    if( t0.isSpecialCharacter() ) // ^, $ or .
		this._throwParseException( "Special character '" + t0.value + "' not allowed in ranges." );

	    //window.alert( "Adding: " + t0 );

	    var tmpChar = new IKRS.RegexCharacter( t0 ); 
	    characters.push( t0 ); 
	    //parentUnion.children.push( tmpChar );
	    
	}


	// Next check: INTERSECTION?
	if( t1.isAndOperator() ) {	
	    
	    // Next token after '&&' must be a new character set
	    // (Note that the next token was already read for t1).

	    // But first: consume '&&'
	    this.tokenizer.nextToken();
	    optionalIntersection = this._readCharacterSet( negate ); // inherit negation sub set? What's the definition???
	    
	    // Restore consistent state (this makes error handling after the loop easier)
	    t1 = this.tokenizer.currentToken;

	} 
	
	// Might be t1 from this loop OR from the recursive function call!
	if( t1.isSetEndOperator() ) {

	    // This will indicate that the ']' was already read (important for nested sets).
	    // The token will NOT be consumed later then.
	    endOfSetReached = true;

	}

	//window.alert( "t0=" + t0 + ", t1=" + t1 );
	t0 = t1;
	i++;

    } // END while
    

    if( characters.length != 0 ) {
	var characterSet = new IKRS.RegexCharacterSet( negate, characters );
	parentUnion.children.push( characterSet );
    }
    
    
    // Empty set really not allowed?
    if( parentUnion.children.length == 0 )
	this._throwParseException( "Empty character set not allowed." );

    var finalRegex = null;
    if( parentUnion.children.length == 1 ) finalRegex = parentUnion.children[0];
    else                                   finalRegex = parentUnion;
	
    
    // Was a nest intersection child found?
    if( optionalIntersection != null )
	finalRegex = new IKRS.RegexIntersection( finalRegex, optionalIntersection );

    
    // Loop terminated. End of set reached?
    if( t0 == null )
	this._throwParseException( "EOI reached where end-of-set ']' is expected." );
    if( !t0.isSetEndOperator() ) 
	this._throwParseException( "Unexpected token '" + t0.value + "' reached, where end-of-set ']' is expected." );

 

    return finalRegex; 
};

/**
 * Precondition: current token is '|' and in this.currentRegex is the
 *               left operand.
 *
 * @throws IKRS.ParseException
 **/  
IKRS.RegexParser.prototype._readUnion = function() {

    // The current token is '|'.
    // So switch to the next token, then read the next regex, then 
    // construct a UNION regex.  
    if( this.tokenizer.nextToken() == null )
	this._throwParseException( "Unexpected EOI after union operator '|'." );

    // Take the last regex
    var lastRegex = this.currentRegex;
    // Parse the next regex
    var nextRegex = this._read(); 

    var union = new IKRS.RegexUnion(lastRegex,nextRegex);
    this.currentRegex = union;

    return union;
};


/**
 * Reads a constant expression from the current position of the input.
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype._readConstant = function( allowDashAsConstant ) {
    
    // Append the current token.
    // It already belongs to the constant (first character).
    var charSequence = new IKRS.TokenSequence();
    charSequence.add( this.tokenizer.currentToken );
    while( this.tokenizer.nextToken() != null &&
	   this.tokenizer.currentToken.isConstant && 
	   (allowDashAsConstant || this.tokenizer.currentToken.value != '-') &&
	   !this.tokenizer.currentToken.isSpecialCharacter()
	 ) {

	charSequence.add( this.tokenizer.currentToken );
    };
	   
    this.currentRegex = new IKRS.RegexConstant( charSequence );

    // Note that the STERN operators bind STRONGER than any other operator!
    while( !this.tokenizer.reachedEOI() && 
	   this.tokenizer.currentToken.isQuantifyingOperator() 
	 ) { 
	

	this._read(); 
    }

    return this.currentRegex;
};


/**
 * This function is used by the readQuantifyer-function to read
 * the attributes from the { ... } pair.
 *
 * @throws IKRS.ParseException
 **/
IKRS.RegexParser.prototype.__readAttributeList = function( baseRegex ) {
    
    var sb            = new IKRS.StringBuffer();
    var attributeList = [];
    var t0            = null;
    var awaitingValue = false;
    while( (t0 = this.tokenizer.nextToken()) != null &&
	   !t0.isQuantifyingEndOperator()
	 ) {
	
	if( t0.isQuantifyingStartOperator() )
	    this._throwParseException( "Could not read quantifyer/attribute list. Unexpected '{' operator." );

	if( t0.value == ',') {
	    // The regex trims the string ^_^
	    baseRegex.attributes.push( new IKRS.RegexAttribute(sb.toString().replace(/^\s+|\s+$/g,'')) );
	    sb = new IKRS.StringBuffer();
	    awaitingValue = true;
	} else {
	    sb.append( t0.value );
	    awaitingValue = false;
	}

    }
    

    // Last attribute present?
    if( sb.length > 0 || awaitingValue )
	baseRegex.attributes.push( new IKRS.RegexAttribute(sb.toString().replace(/^\s+|\s+$/g,'')) );

    

    if( this.tokenizer.reachedEOI() )
	this._throwParseException( "EOI reached when reading quantifyer/attribute list. Missing end-of-attributes '}' operator." );

    if( !this.tokenizer.currentToken.isQuantifyingEndOperator() )
	this._throwParseException( "Could not read quantifyer/attribute list. Missing end-of-attributes '}' operator." );


};

/**
 * Throws a ParseException witht the current read offsets.
 *
 * @throws ParseException
 **/
IKRS.RegexParser.prototype._throwParseException = function( errmsg ) {
    throw new IKRS.ParseException( errmsg,
				   this.tokenizer.pushbackReader.position,
				   this.tokenizer.pushbackReader.position+1
				 );
};


IKRS.RegexParser.prototype.constructor = IKRS.RegexParser;
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
	if( this.tokens[i].isEscaped )
	    sb.append( this.tokens[i].rawValue );
	else
	    sb.append( this.tokens[i].value );
    }
    return sb.toString();
};

IKRS.TokenSequence.prototype.constructor = IKRS.TokenSequence;
/**
 * A generic parse exception class.
 *
 * @author Ikaros Kappler
 * @date 2014-04-12
 * @version 1.0.0
 **/

IKRS.ParseException = function( errorMessage,
				startOffset,
				endOffset
			      ) {

    IKRS.Object.call( this );
    
    this.errorMessage = errorMessage;
    this.startOffset  = startOffset;
    this.endOffset    = endOffset;

};



IKRS.ParseException.prototype.constructor = IKRS.ParseException;

/**
 * @author Ikaros Kappler
 * @date 2014-04-13
 * @version 1.0.0
 **/

IKRS.MatchResult = function( matchStatus,
			     //matchStart,
			     matchLength,
			     
			     beginMark,
			     endMark
			   ) {

    IKRS.Object.call( this );

    this.matchStatus = matchStatus;
    //this.matchStart  = matchStart;
    this.matchLength = matchLength;
    
    this.beginMark   = beginMark;
    this.endMark     = endMark;

};

IKRS.MatchResult.STATUS_COMPLETE   = 0;
//IKRS.MatchResult.STATUS_INCOMPLETE = 1;
IKRS.MatchResult.STATUS_FAIL       = 1;

IKRS.MatchResult.status2name = function( statusID ) {
    switch( statusID ) {
    case IKRS.MatchResult.STATUS_COMPLETE:   return "COMPLETE";
    //case IKRS.MatchResult.STATUS_INCOMPLETE: return "INCOMLETE";
    case IKRS.MatchResult.STATUS_FAIL:       return "FAIL";
    default:                                 return "UNKNOWN(" + statusID + ")";
    }
};

IKRS.MatchResult.prototype.toString = function() {
    return "[IKRS.MatchResult]={" +
	" matchStatus=" + IKRS.MatchResult.status2name(this.matchStatus) + 
	//", matchStart=" + this.matchStart + 
	", matchLength=" + this.matchLength + 
	", matchBeginPosition=" + this.beginMark.position + 
	", matchEndPosition=" + this.endMark.position +
	" }";
};

IKRS.MatchResult.prototype.constructor = IKRS.MatchResult;
/**
 * An Analyzer keeps an array of named regular expressions (objects with a 'match' function)
 * and is capable to split input strings into token sequences.
 * Each returned token is named by its matching regular expression.
 *
 * The analyzer's most important function is 'nextMatch()', which tries to locate the next
 * matching rule to perform the associated action.
 *
 *
 * @author  Ikaros Kappler
 * @date    2014-04-17
 * @version 1.0.0
 **/


IKRS.Analyzer = function() {

    IKRS.Object.call( this );

    // The rules array contains items with the structure:
    //  { name:           [string],
    //    regex:          [regexp],
    //    action:         [function(name,value,matchResult)],
    //    callbackParams: [object]
    //  }
    this.rules = [];
};


/**
 * Add a new rule to this analyzer.
 *
 * @param name   [string]         The rule's name. Can by any string.
 * @param regex  [string|regexp]  The rule's regular expression. If the passed value is a string
 *                                it will be parsed to a regular expression, which may result in
 *                                a parse exception.
 * @param action [function]       A callback function to call when the passed regex matches the input.
 *                                The function must have this signature:
 *                                function( name[string], 
 *                                          value[string], 
 *                                          matchResult[IKRS.MatchResult], 
 *                                          callbackParams[object] 
 *                                        );
 * @param callbackParams [*]      Any object/value; will be passed to the callback function.
 *
 * @throws IKRS.ParseException
 **/
IKRS.Analyzer.prototype.addRule = function( name, regex, action, callbackParams ) {

    if( typeof regex == "string" ) {

	var parser = new IKRS.RegexParser( new IKRS.RegexTokenizer( new IKRS.PushbackStringReader(regex) ) );
	var regex_obj  = parser.parse();  // may throw ParseException
	//window.alert( "regex(text)=" + regex + ", regex(object)=" + regex_obj );
	if( regex_obj == null )
	    throw "Cannot add empty regex expressions to the analyzer's rule list.";
	this._addRule( name, regex_obj, action, callbackParams );
	return true;

    } else if( typeof regex == "object" && typeof regex.match == "function" ){
	
	this._addRule( name, regex, action, callbackParams );

    } else {

	throw "Cannot add a non-string/non-regexp to this analyzer.";

    }

};

/**
 * Add a new name/rule pair to this analyzer.
 **/
IKRS.Analyzer.prototype._addRule = function( name, regex, action, callbackParams ) {
        
    this.rules.push( { name:           name, 
		       regex:          regex,
		       action:         action,
		       callbackParams: callbackParams
		     } 
		   );
    return true;
};

/**
 * The nextMatch function starts the rule based matching process and tries
 * to find the next matching regular expression, beginning at index 0 in
 * the rule list.
 *
 * There are two possible behaviors:
 *  (a) getFirstMatch == true:  the first matching rule applies.
 *  (b) getFirstMatch == false: the longest matching rule applies.
 *
 * If a matching rule was found (first or longest) the respective rule's
 * action (callback function) is called.
 *
 * The found match result then is returned.
 **/
IKRS.Analyzer.prototype.nextMatch = function( reader, getFirstMatch ) {
    
    // Fetch reader position mark
    var beginMark           = reader.getMark();
    
    //var STOP_AT_FIRST_MATCH = true;
    var longestMatchList    = [];
    // Try token by token and detect the longest match for each.
    // Collect the longest matches.
    var longestMatchCount   = 0;
    for( var i = 0; i < this.rules.length && (!getFirstMatch || longestMatchCount == 0); i++ ) {

	// Fetch next array of results
	reader.resetTo( beginMark );
	var matchResult = this.rules[i].regex.match( reader );
	
	// Locate longest match
	var longestMatch = IKRS.Analyzer._getLongestMatch( matchResult, 
							   false        // Don't allow zero length
							 );
	// May be null
	longestMatchList.push( longestMatch ); 
	    
	if( longestMatch != null )
	    longestMatchCount++;

    }
    
    // Now detect the longest match of all.
    var index = IKRS.Analyzer._locateLongestMatch( longestMatchList, 
						   true               // allowZeroLength
						 );
    
    // Call action?
    if( index != -1 && 
	this.rules[index].action != null 
      ) {

	// Re-fetch longest match
	longestMatch = longestMatchList[ index ];

	// Fetch token from reader ^^	
	var value = reader.extractFromString( longestMatch.beginMark, 
					      longestMatch.endMark );
	
	// Set mark to as-if token was just read
	reader.resetTo( longestMatch.endMark );

	
	this.rules[index].action( this.rules[index].name,           // rule.name
				  value,
				  longestMatch,
				  this.rules[index].callbackParams
				);
	
	return longestMatch;

    } else {

	return null;

    }
};


/**
 * Ecpects and array of MatchResult elements and returns the longest match
 * with the smallest index.
 **/
IKRS.Analyzer._getLongestMatch = function( matchResult, allowZeroLength ) {
    var index  = IKRS.Analyzer._locateLongestMatch( matchResult, allowZeroLength );
    if( index == -1 )
	return null;
    else
	return matchResult[ index ];
};


/**
 * Ecpects and array of MatchResult elements and returns the index of the
 * longest match with the smallest index.
 *
 * If no match is contained in the array the function returns -1.
 **/
IKRS.Analyzer._locateLongestMatch = function( matchResult, allowZeroLength ) {
    var index  = -1;
    var length = -1;
    for( var i = 0; i < matchResult.length; i++ ) {
	if( matchResult[i] != null &&
	    matchResult[i].matchStatus == IKRS.MatchResult.STATUS_COMPLETE && 
	    (allowZeroLength || matchResult[i].matchLength > length)
	  ) {
	    index  = i;
	    length = matchResult[i].matchLength;
	}
    }
    
    return index;
}


IKRS.Analyzer.prototype.constructor = IKRS.Analyzer;

/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConstant = function( tokenSequence ) {

    IKRS.Pattern.call( this, "CONSTANT[" + tokenSequence.toString() + "]" );

    this.tokenSequence = tokenSequence;
};

IKRS.RegexConstant.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // Try to read token by token from the reader
    for( var i = 0; i < this.tokenSequence.tokens.length; i++ ) {

	var token = this.tokenSequence.tokens[i];
	var c     = reader.read();
	
	if( c == -1 ) {
	    // EOI is no real character
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   //0,
					   i,    // length
					   beginMark,
					   reader.getMark()
					 )
		   ];
	} else if( c != token.value ) {
	    // Token does not match
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   //0,
					   i,    // length
					   beginMark,
					   reader.getMark()
					 )
		   ];
	    
	    
	} 
	// else: noop

    } // END for

    // All expected characters found.
    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
				   //0,
				   this.tokenSequence.tokens.length,   // matchLength
				   beginMark,
				   reader.getMark()
				 )
	   ];
    
};

IKRS.RegexConstant.prototype.toString = function() {
    //return "(" + this.charSequence + ")";
    return this.tokenSequence.toString();
};


IKRS.RegexConstant.prototype.constructor     = IKRS.RegexConstant;

IKRS.RegexConstant.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexConstant.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexConstant.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexConstant.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexUnion = function( opt_left, opt_right ) {

    IKRS.Pattern.call( this, "UNION" );


    // children member inherited from IKRS.Pattern
    //this.children = [];

    if( opt_left != null ) 
	this.children.push( opt_left );
    if( opt_right != null ) 
	this.children.push( opt_right );
};


IKRS.RegexUnion.prototype.match = function( reader ) {
    
    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    
    // At least one child must match
    //  -> each mathing child belongs to the result set.
    var result = [];
    for( var i = 0; i < this.children.length; i++ ) {

	// Reset to begin
	reader.resetTo( beginMark );
	var tmpResult = this.children[i].match( reader );

	
	for( var e = 0; e < tmpResult.length; e++ ) {

	    if( tmpResult[e].matchStatus != IKRS.MatchResult.STATUS_COMPLETE )
		continue; // ignore
	    
	    result.push( tmpResult[e] );

	} // END for

    } // END for
    
    return result;
};

IKRS.RegexUnion.prototype.toString = function() {
    
    var str = "(";
    for( var i = 0; i < this.children.length; i++ ) {
	if( i > 0 )
	    str += "|";
	str += this.children[i].toString();
    }
    str += ")";
    
    //return "(" + this.left + "|" + this.right + ")";
    return str;
};


IKRS.RegexUnion.prototype.constructor     = IKRS.RegexUnion;

IKRS.RegexUnion.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexUnion.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexUnion.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexUnion.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
/**
 * @author Ikaros Kappler
 * @date 2013-04-10
 * @version 1.0.0
 **/


IKRS.RegexIntersection = function( opt_left, opt_right ) {

    IKRS.Pattern.call( this, "INTERSECTION" );


    // children member inherited from IKRS.Pattern
    //this.children = [];

    if( opt_left != null ) 
	this.children.push( opt_left );
    if( opt_right != null ) 
	this.children.push( opt_right );
};

IKRS.RegexIntersection.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();


    if( this.children.length == 0 ) {

	return [];

    }



    // At least one child must match
    //  -> each mathing child belongs to the result set.
    var result = this.children[0].match( reader );
    if( result.length == 0 )
	return [];

    //window.alert( result );

    for( var i = 1; i < this.children.length; i++ ) {

	var tmpResult = [];

	reader.resetTo( beginMark );
	var subResult = this.children[i].match( reader );
	//window.alert( "subResult[" + i + "]=" + subResult );
	
	// Check for result/subresult intersection (must have same lengths!)
	for( var a = 0; a < result.length; a++ ) {

	    if( result[a].matchStatus != IKRS.MatchResult.STATUS_COMPLETE )
		continue;

	    for( var b = 0; b < subResult.length; b++ ) {

		if( subResult[b].matchStatus != IKRS.MatchResult.STATUS_COMPLETE )
		    continue;
		
		if( result[a].matchLength != subResult[b].matchLength )
		    continue;

		// Both match -> keep
		tmpResult.push( result[a] );

	    }

	}
	
	// Keep smaller intersection
	result = tmpResult;

    }
    
    return result;
};

IKRS.RegexIntersection.prototype.toString = function() {
    
    var str = "(";
    for( var i = 0; i < this.children.length; i++ ) {
	if( i > 0 )
	    str += "&&";
	str += this.children[i];
    }
    str += ")";
    
    //return "(" + this.left + "|" + this.right + ")";
    return str;
};


IKRS.RegexIntersection.prototype.constructor     = IKRS.RegexIntersection;

IKRS.RegexIntersection.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexIntersection.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexIntersection.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexIntersection.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexQuantifyer = function( baseRegex,
				 minCount,
				 maxCount    // -1 indicates infinity
			       ) {

    IKRS.Pattern.call( this, "QUANTIFYER{"+minCount+","+maxCount+"}" );

    this.baseRegex = baseRegex;
    this.minCount  = minCount;
    this.maxCount  = maxCount;

    // For consistency
    this.children.push( baseRegex );
};

IKRS.RegexQuantifyer.prototype.match = function( reader ) {


    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    var i = 0;
    var c;
    var mark;
    // Check how many times the base pattern can be repeatedly matched.
    //var result = [];

    // Note: with Kleene Stern Operators and partial/empty sub results the
    //       temp result set might become _extremely_ large, even though the
    //       final result is small. That's because EMPTY/PARTIAL might result
    //       from different sub expressions.
    // Example: ([a-c][d-f][g-i][j-l])*    and any alphabetical input.
    //          This has already four sub results with length 0 at the fist
    //          position.
    //          At the second position are again 4 empty sub result, makes up
    //          4*4 = 16 empty subresult at read position 1.
    //          At position 2 there are at least 64 results, at position 3 there
    //          are at least 256 results (plus the real non-empty results).
    //          An input string with 20 characters has at least 1.048.576
    //          sub results. That's not acceptable!
    // Solution: use a Set instead of an array and only add sub results that
    //           are really new.
    var uniqueResult = new IKRS.ArraySet( [], 
					  { equal: function(a,b) { 
					      return (a.matchStatus == b.matchStatus 
						      &&
						      a.beginMark.position && b.beginMark.position 
						      &&
						      a.matchLength == b.matchLength
						     )
					  } // END function
					  } // END object
					);


    var tmpResults = this.baseRegex.match( reader );

    // Empty expression allowed?    
    if( this.minCount == 0 ) {
	uniqueResult.addUnique( new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
						      0,  // matchLength
						      beginMark,
						      beginMark  // Nothing read :)
						    ) );
    }

    while( i < tmpResults.length ) {

	// We are not interested in failed match tries here.
	if( tmpResults[i].matchStatus == IKRS.MatchResult.STATUS_COMPLETE  ) {
	    
	    // Inside quantifyer bounds?
	    if( (i+1) >= this.minCount && (i+1) <= this.maxCount ) {
		uniqueResult.addUnique( new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
							      tmpResults[i].endMark.position - beginMark.position,
							      beginMark,
							      tmpResults[i].endMark
							    ) );
	    }

	    
	    // Set the read position of the temp result's ending position
	    if( !reader.resetTo(tmpResults[i].endMark) )
		throw "[IKRS.RegexQuantifyer.match(...)] Failed to set read position to " + tmpResults[i].endMark.position + ".";

	    // Try to re-match from the new position
	    var subResults = this.baseRegex.match( reader );
	    for( var e = 0; e < subResults.length; e++ ) {
		if( subResults[e].matchStatus == IKRS.MatchResult.STATUS_COMPLETE && subResults[e].matchLength > 0 ) {
		    //window.alert( "Adding result [e=" + e + "] " + subResults[e] );
		    tmpResults.push( subResults[e] );
		}
	    }
	    

	}

	i++;
    } // END while

    return uniqueResult.elements; 
    
};

IKRS.RegexQuantifyer.prototype.toString = function() {

    if( this.maxCount == Number.POSITIVE_INFINITY ) {
	if( this.minCount == 0 )
	    return "(" + this.baseRegex.toString() + "*)";
	else if( this.minCount == 1 )
	    return "(" + this.baseRegex.toString() + "+)";
	else
	    return "(" + this.baseRegex.toString() + "{" + this.minCount + ",})";
    } else if( this.maxCount == this.minCount ) { //this.maxCount != Number.POSITIVE_INFINITY ) {
	return "(" + this.baseRegex.toString() + "{" + this.minCount + "})";
    } else {
	return "(" + this.baseRegex.toString() + "{" + this.minCount + "," + this.maxCount + "})";
    }
    
};



IKRS.RegexQuantifyer.prototype.constructor     = IKRS.RegexQuantifyer;

IKRS.RegexQuantifyer.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexQuantifyer.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexQuantifyer.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexQuantifyer.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/


IKRS.RegexConcatenation = function( opt_left, opt_right ) {

    IKRS.Pattern.call( this, "CONCATENATION" );

    //this.left  = opt_left;
    //this.right = opt_right;
    
    // Add children to list by default
    if( opt_left != null )
	this.children.push( opt_left );

    if( opt_right != null )
	this.children.push( opt_right );
};

IKRS.RegexConcatenation.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // What's the concatenation of -empty-?
    if( this.children.length == 0 ) {

	// Hmmm ... equivalent to RegExp '()'
	// Does '()' match any input or none?
	// Btw. the parser does not produce such a Concatenation.
	return [];

    }
    

    var result    = [];
    var tmpResult = this.children[0].match( reader );
    //window.alert( "CONCATENATION leftest result: #" + tmpResult.length + ", values=" + tmpResult );
    for( var i = 1; i < this.children.length; i++ ) {

	result = this._matchRight( reader, beginMark, tmpResult, i );
	tmpResult = result;

    }


    return result;
};

IKRS.RegexConcatenation.prototype._matchRight = function( reader, beginMark, tmpResult, offset ) {

    var result = [];
    for( var e = 0; e < tmpResult.length; e++ ) {

	// Ignore incomplete/failed matches (if exist)?
	if( tmpResult[e].matchStatus != IKRS.MatchResult.STATUS_COMPLETE )
	    continue;
	
	
	// Set read position to end of current result
	reader.resetTo( tmpResult[e].endMark );
	
	
	var subResult = this.children[offset].match( reader );
	// Keep COMPLETE sub results in final result
	for( var f = 0; f < subResult.length; f++ ) {

	    if( subResult[f].matchStatus != IKRS.MatchResult.STATUS_COMPLETE ) 
		continue; // Ignore

	    result.push( new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					       subResult[f].endMark.position - beginMark.position,  // length
					       beginMark,
					       subResult[f].endMark
					     )
		       );
	    
	}

    }
    
    return result;
};


IKRS.RegexConcatenation.prototype.toString = function() {
    //return "(" + this.left.toString() + this.right.toString() + ")";
    var sb = new IKRS.StringBuffer();
    sb.append( "(" );
    for( var i = 0; i < this.children.length; i++ ) {
	sb.append( this.children[i].toString() );
    }	
    sb.append( ")" );
    return sb.toString();
};

IKRS.RegexConcatenation.prototype.addRegex = function( regex ) {
    this.children.push( regex );
};

IKRS.RegexConcatenation.prototype.constructor     = IKRS.RegexConcatenation;

IKRS.RegexConcatenation.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexConcatenation.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexConcatenation.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexConcatenation.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
/**
 * @author Ikaros Kappler
 * @date 2014-04-10
 * @version 1.0.0
 **/


IKRS.RegexCharacter = function( token ) {

    IKRS.Pattern.call( this, "CHARACTER[" + token.value + "]" );

    /*this.characterValue = characterValue;
    this.characterCode  = characterCode;
    this.rawValue       = rawValue;
    */
    this.token = token;
    
    // Also add to children list
    //this.children.push( token );
};


IKRS.RegexCharacter.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // Try to read one token from the reader 
    var c     = reader.read();
    
    if( c == -1 ) {
	// EOI is no real character
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       //0,
				       0,
				       beginMark,
				       reader.getMark()
				     ) 
	       ];
    } else if( c != this.token.value ) {
	// Token does not match
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       //0,
				       0,
				       beginMark,
				       reader.getMark()
				     )
	       ];
	
	
    } else {

	// Expected character found.
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
				       //0,
				       1,
				       beginMark,
				       reader.getMark()
				     )
	       ];
    }
};

IKRS.RegexCharacter.prototype.toString = function() {
    if( this.token.isEscaped )
	return this.token.rawValue;    // Eventually the *real* character value is not printable
    else
	return this.token.value;
};


IKRS.RegexCharacter.prototype.constructor     = IKRS.RegexCharacter;

IKRS.RegexCharacter.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexCharacter.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexCharacter.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexCharacter.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
/**
 * @author Ikaros Kappler
 * @date 2013-04-09
 * @version 1.0.0
 **/

/**
 * The passed characters array must consist (if not null) of IKRS.RegexToken
 * instances.
 **/
IKRS.RegexCharacterSet = function( negate, opt_characters ) {

    IKRS.Pattern.call( this, "SET[...]" );

    this.negate            = negate;
    
    if( opt_characters != null )
	this.characters = opt_characters;
    else
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

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // Read one character from the reader.
    var c = reader.read();
    
    // And try to match it.
    if( c == -1 ) {

	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       //0,
				       0,
				       beginMark,
				       reader.getMark()
				     )
	       ];

    } else if( this.negate ) {

	for( var i = 0; i < this.characters.length; i++ ) {
	    // Negation. No character must match.
	    var token = this.characters[i];
	    if( token.value == c ) {
		return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					       //0,  // read index 0 of input
					       0,   // 0 characters matched
					       beginMark,
					       reader.getMark()
					     )
		       ];
	    }	    	    
	} // END for
	// Loop terminated: character does not belong to negated set.
	// -> matches
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
				       //0,  // read index 0 of input
				       1,   // 1 character matching
				       beginMark,
				       reader.getMark()
				     )
	       ];

    } else {

	for( var i = 0; i < this.characters.length; i++ ) {
	    // No negation. At least one character must match.
	    var token = this.characters[i];
	    if( token.value == c ) {
		return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					       //0,  // read index 0 of input
					       1,   // 1 character matching
					       beginMark,
					       reader.getMark()
					     )
		       ];
	    } 
	} // END for
	// Loop terminated: character does not belong to normal set.
	//  -> no match at all
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       //0,  // read index 0 of input
				       0,   // 0 characters matched
				       beginMark,
				       reader.getMark()
				     )
	       ];
    }
};

IKRS.RegexCharacterSet.prototype.toString = function() {
    var str = "[";
    if( this.negate )
	str += "^";

    for( var i = 0; i < this.characters.length; i++ ) {
	if( this.characters[i].isEscaped )
	    str += this.characters[i].rawValue;
	else
	    str += this.characters[i].value;
    }

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
	    str += " ";
	if( this.characters[i].isEscaped )
	    str += this.characters[i].rawValue;
	else
	    str += this.characters[i].value;
    }

    str += "]";
    return str;
};


IKRS.RegexCharacterSet.prototype.constructor     = IKRS.RegexCharacterSet;

//IKRS.RegexCharacterSet.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexCharacterSet.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexCharacterSet.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexCharacterSet.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
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

    IKRS.Pattern.call( this, "RANGE[" + ( negate ? "NOT " : "" ) + startSymbol.value + "-" + endSymbol.value + "]" );

    this.negate            = negate;
    this.startSymbol       = startSymbol;
    this.endSymbol         = endSymbol;    
};


IKRS.RegexCharacterRange.prototype.match = function( reader ) {

    // Fetch the current read mark from the reader.
    var beginMark = reader.getMark();

    // Read one character from the input
    var c     = reader.read();
    
    // EOI reached?
    if( c == -1 ) {

	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       //0,   // read index 0 if input
				       0,     // no characters matching
				       beginMark,
				       reader.getMark()
				     )
	       ];
    } else {
	
	var cCode = c.charCodeAt( 0 );
	var characterMatches = 
	    ( this.startSymbol.getCharacterCode() <= cCode 
	      && 
	      cCode <= this.endSymbol.getCharacterCode()
	    );

	//window.alert( "beginCode=" + this.startSymbol.getCharacterCode() + ", code=" + cCode + ", endCode=" + this.endSymbol.getCharacterCode() + ", matches=" + characterMatches );

	if( (this.negate && !characterMatches) || (!this.negate && characterMatches) ) {

	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					   1,    // one character matching
					   beginMark,
					   reader.getMark()
					 )
		   ];
	    
	} else {

	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   0,    // no characters matching
					   beginMark,
					   reader.getMark()
					 )
		   ];

	}

    }

};

IKRS.RegexCharacterRange.prototype.toString = function() {
    var str = "[";

    if( this.negate )
	str += "^";

    //str += this.startSymbol.value + "-" + this.endSymbol.value;
    //str += this.startSymbol.tokenvalue + "-" + this.endSymbol.token.value;
    str += this.startSymbol.value + "-" + this.endSymbol.value;

    str += "]";
    return str;
};


IKRS.RegexCharacterRange.prototype.constructor     = IKRS.RegexCharacterRange;

IKRS.RegexCharacterRange.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexCharacterRange.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexCharacterRange.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexCharacterRange.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
/**
 * This is an abstract super class for all predefined character classes.
 *
 * Each subclass MUST implement the match() function!
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-12
 * @version 1.0.0
 **/


IKRS.RegexSpecialCharacter = function( token, name ) {

    IKRS.Pattern.call( this, (name == null ? "SPECIAL[" + token.rawValue + "]" : name) );


    this.token = token;
    
    // Also add to children list?
    //this.children.push( token );
};


IKRS.RegexSpecialCharacter.prototype.match = function( reader ) {
    

    throw "[IKRS.RegexSpecialCharacter.match(...)] This class is abstract and the 'match' function must be overridden by its subclasses before it can be used.";

    /*
    var beginMark = reader.getMark();


    if( this.token.isBeginOfInputCharacter() ) {
	
	var status = null;
	if( reader.atBeginOfInput() )    status = IKRS.MatchResult.STATUS_COMPLETE;
	else                             status = IKRS.MatchResult.STATUS_FAIL;
	    
	    
	return [ new IKRS.MatchResult( status,
				       0,      // length is 0, because BEGIN-OF-INPUT is no real consumable symbol
				       beginMark, 
				       beginMark
				     ) ];
	

    } else if( this.token.isEndOfInputCharacter() ) {
	
	var status = null;
	if( reader.reachedEOI() || reader.available() == 0 )  status = IKRS.MatchResult.STATUS_COMPLETE;
	else                                                  status = IKRS.MatchResult.STATUS_FAIL;
	
	reader.read();
	return [ new IKRS.MatchResult( status,
				       1,      // length is 0 or 1? BEGIN-OF-INPUT is no real consumable symbol ...
				       beginMark, 
				       beginMark
				     ) ];
	

    } else if( this.token.isWildcardCharacter() ) {
	
	//window.alert( "isWildCard; reader.position=" + reader.position + ", reachedEOI=" + reader.reachedEOI() + ", available=" + reader.available() );

	// Is there any input available at all?	
	if( reader.reachedEOI() || reader.available() == 0 ) {
	    // Nothing to read
	    //reader.read();
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   0,      // length is 0
					   beginMark, 
					   reader.getMark() // beginMark
					 ) ]; 
	} else {
	    // Read exactly one anonymous symbol
	    reader.read();
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					   1,      // length is 1
					   beginMark, 
					   reader.getMark()
					 ) ];
	}
	
    } else {
	// This must not happen!
	// IF it happens then the parser is faulty.
	throw "[IKRS.RegexSpecialCharacter] Runtime Error: my internal token is NOT a special character (" + token.rawValue + ").";
    }

    */
};

IKRS.RegexSpecialCharacter.prototype.toString = function() {
    
    if( this.token.isEscaped )
	return this.token.rawValue;    // Eventually the *real* character value is not printable
    else
	return this.token.value;
    
};


/**
 * This static function is used by the parser to keep the code small.
 *
 * It decides from the passed special character token which RegEx class should be used.
 *
 *
 **/
IKRS.RegexSpecialCharacter.createFromToken = function( token ) {

    if( !token.isSpecialCharacter() )
	throw "[IKRS.RegexSpecialCharacter.createFromToken(...){static}] Cannot create RegExp from token '" + token.rawValue + "'. It seems not to be a special character. Does your parser work correctly?";

    
    if( token.isBeginOfInputCharacter() )
	return new IKRS.RegexBeginOfInput(token);   
    else if( token.isEndOfInputCharacter() )
	return new IKRS.RegexEndOfInput(token);    
    else if( token.isWildcardCharacter() )
	return new IKRS.RegexWildcard(token); // RegexSpecialCharacter(token);
    else if( token.isDigitClassCharacter() ) 
	return new IKRS.RegexDigit( token,      false );  // Don't negate the set
    else if( token.isNonDigitClassCharacter() )
	return new IKRS.RegexDigit( token,      true );   // Negate the set
    else if( token.isWhitespaceClassCharacter() )
	return new IKRS.RegexWhitespace( token, false );  // Don't negate the set
    else if( token.isNonWhitespaceClassCharacter() )
	return new IKRS.RegexWhitespace( token, true );   // Negate the set
    else if( token.isWordClassCharacter() )
	return new IKRS.RegexWord( token,       false );  // Don't negate the set
    else if( token.isNonWordClassCharacter() )
	return new IKRS.RegexWord( token,       true );   // Negate the set
    else
	throw "[IKRS.RegexSpecialCharacter.createFromToken(...){static}] Cannot create RegExp from token '" + token.rawValue + "'. It is a special character but does not match any expected case. Does your parser work correctly?";

};


IKRS.RegexSpecialCharacter.prototype.constructor     = IKRS.RegexSpecialCharacter;

IKRS.RegexSpecialCharacter.prototype.getName         = IKRS.Pattern.prototype.getName;
IKRS.RegexSpecialCharacter.prototype.getValue        = IKRS.Pattern.prototype.getValue
IKRS.RegexSpecialCharacter.prototype.getChildren     = IKRS.Pattern.prototype.getChildren;
IKRS.RegexSpecialCharacter.prototype.getAttributes   = IKRS.Pattern.prototype.getAttributes;
/**
 * The predefined character class for whitespace (\s) respective (\S).
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 * Whitespace characters are:
 *  - 0x20 (' ')   The regular space character.
 *  - \n           Line break.
 *  - 0x0B         Line Feed.
 *  - \t           Tabulator.
 *  - \f           Form Feed.
 *  - \r           Carriage Return.
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexWhitespace = function( token, negate ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     (negate ? "NON-WHITESPACE[\\S]" : "WHITESPACE[\\s]") 
				   );


    this.negate = negate;
    
};


/**
 * @override
 **/
IKRS.RegexWhitespace.prototype.match = function( reader ) {
    
    // Create read mark at current position.
    var beginMark = reader.getMark();
	
    // Is there any input available at all?	
    if( reader.reachedEOI() || reader.available() == 0 ) {
	// Nothing to read
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       0,               // length is 0
				       beginMark, 
				       reader.getMark() 
				     ) ]; 
    } else {
	// Read exactly one anonymous symbol (convert to string)
	var c = new String("" + reader.read());
	//window.alert( "symbol read: " + c );
	
	// Decide if it is a whitespace character.
	var isWhitespace = 
	    ( c == ' ' ||
	      c == '\n' || 
	      c.charCodeAt(0) == 0x0B ||
	      c == '\t' ||
	      c == '\f' 
	    );

	//window.alert( "symbol read: " + c + ", isWhitespace=" + isWhitespace );

	if( (this.negate && isWhitespace) || (!this.negate && !isWhitespace) ) {

	    // Match fail
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   0,               // matchLength is 0
					   beginMark, 
					   reader.getMark() 
					 ) ]; 	   

	} else {
	    
	    // Match success
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					   1,               // matchLength is 1
					   beginMark, 
					   reader.getMark()
					 ) ];
	}
    }
	

};

/*
IKRS.RegexWhitespace.prototype.toString = function() {

    if( this.token.isEscaped )
	return this.token.rawValue;    // Eventually the *real* character value is not printable
    else
	return this.token.value;
};
*/


IKRS.RegexWhitespace.prototype.constructor     = IKRS.RegexWhitespace;

IKRS.RegexWhitespace.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexWhitespace.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexWhitespace.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexWhitespace.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexWhitespace.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;

/**
 * The predefined character class for digits (\d) respective (\D).
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 * Digit characters are 0, 1, 2, ... , 9, or short: [0-9].
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexDigit = function( token, negate ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     (negate ? "NON-DIGIT[\\D]" : "DIGIT[\\s]") 
				   );


    this.negate = negate;
    
};


/**
 * @override
 **/
IKRS.RegexDigit.prototype.match = function( reader ) {
    
    // Create read mark at current position.
    var beginMark = reader.getMark();
	
    // Is there any input available at all?	
    if( reader.reachedEOI() || reader.available() == 0 ) {
	// Nothing to read
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       0,               // length is 0
				       beginMark, 
				       reader.getMark() 
				     ) ]; 
    } else {
	// Read exactly one anonymous symbol (convert to string)
	var c = new String("" + reader.read());
	
	// Decide if it is a digit character.
	var isDigit = 
	    ( c.charCodeAt(0) >= 0x30 && c.charCodeAt(0) <= 0x39 );


	if( (this.negate && isDigit) || (!this.negate && !isDigit) ) {

	    // Match fail
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   0,               // matchLength is 0
					   beginMark, 
					   reader.getMark() 
					 ) ]; 	   

	} else {
	    
	    // Match success
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					   1,               // matchLength is 1
					   beginMark, 
					   reader.getMark()
					 ) ];
	}
    }
	

};


IKRS.RegexDigit.prototype.constructor     = IKRS.RegexDigit;

IKRS.RegexDigit.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexDigit.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexDigit.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexDigit.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexDigit.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;

/**
 * The predefined character class for word characters (in a programmer's sense), (\w) respective (\W).
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 * Word characters are:
 *  - Digits: [0-9].
 *    OR
 *  - Lowercase characters: [a-z]
 *    OR
 *  - Uppercase characters: [A-Z]
 *    OR
 *  - Underscore: _
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexWord = function( token, negate ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     (negate ? "NON-WORD[\\W]" : "WORD[\\w]") 
				   );


    this.negate = negate;
    
};


/**
 * @override
 **/
IKRS.RegexWord.prototype.match = function( reader ) {
    
    // Create read mark at current position.
    var beginMark = reader.getMark();
	
    // Is there any input available at all?	
    if( reader.reachedEOI() || reader.available() == 0 ) {
	// Nothing to read
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       0,               // length is 0
				       beginMark, 
				       reader.getMark() 
				     ) ]; 
    } else {
	// Read exactly one anonymous symbol (convert to string)
	var c = new String("" + reader.read());
	
	// Decide if it is a digit character.
	var isWordCharacter = 
	    (
		( c.charCodeAt(0) >= 0x30 && c.charCodeAt(0) <= 0x39 ) || // is digit?
		( c.charCodeAt(0) >= 0x61 && c.charCodeAt(0) <= 0x7A ) || // is lowercase character?
		( c.charCodeAt(0) >= 0x41 && c.charCodeAt(0) <= 0x5A ) || // is uppercase character?
		c == '_'                                                  // is underscore?
	    );


	if( (this.negate && isWordCharacter) || (!this.negate && !isWordCharacter) ) {

	    // Match fail
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
					   0,               // matchLength is 0
					   beginMark, 
					   reader.getMark() 
					 ) ]; 	   

	} else {
	    
	    // Match success
	    return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
					   1,               // matchLength is 1
					   beginMark, 
					   reader.getMark()
					 ) ];
	}
    }
	

};


IKRS.RegexWord.prototype.constructor     = IKRS.RegexWord;

IKRS.RegexWord.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexWord.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexWord.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexWord.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexWord.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;

/**
 * The RegEx class for BEGIN-OF-INPUT which is no actual symbol from the input but more
 * the complementary part of END-OF-INPUT (EOI).
 *
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexBeginOfInput = function( token ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     "BEGIN-OF-INPUT[^]" 
				   );


    
};


/**
 * @override
 **/
IKRS.RegexBeginOfInput.prototype.match = function( reader ) {
    
    // Fetch current read mark.
    var beginMark = reader.getMark();

    
    var status = null;
    if( reader.atBeginOfInput() )    status = IKRS.MatchResult.STATUS_COMPLETE;
    else                             status = IKRS.MatchResult.STATUS_FAIL;
    
    
    return [ new IKRS.MatchResult( status,
				   0,      // length is 0, because BEGIN-OF-INPUT is no real consumable symbol
				   beginMark, 
				   beginMark
				 ) ];
    

};


IKRS.RegexBeginOfInput.prototype.constructor     = IKRS.RegexBeginOfInput;

IKRS.RegexBeginOfInput.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexBeginOfInput.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexBeginOfInput.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexBeginOfInput.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexBeginOfInput.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;

/**
 * The RegEx class for END-OF-INPUT (EOI) which is no actual symbol from the input but more
 * the complementary part of BEGIN-OF-INPUT.
 *
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexEndOfInput = function( token ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     "END-OF-INPUT[^]" 
				   );

    
};


/**
 * @override
 **/
IKRS.RegexEndOfInput.prototype.match = function( reader ) {
    
    // Fetch current read mark.
    var beginMark = reader.getMark();


    var status = null;
    if( reader.reachedEOI() || reader.available() == 0 )  status = IKRS.MatchResult.STATUS_COMPLETE;
    else                                                  status = IKRS.MatchResult.STATUS_FAIL;
    
    //reader.read();
    return [ new IKRS.MatchResult( status,
				   0,      // length is 0 or 1? END-OF-INPUT is no real consumable symbol ...
				   beginMark, 
				   beginMark
				 ) ];
    

};


IKRS.RegexEndOfInput.prototype.constructor     = IKRS.RegexEndOfInput;

IKRS.RegexEndOfInput.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexEndOfInput.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexEndOfInput.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexEndOfInput.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexEndOfInput.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;

/**
 * The Wildcard RegEx class. The wildcard matches any character from the input.
 *
 * Its super class is IKRS.RegexSpecialCharacter.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-15
 * @version 1.0.0
 **/


IKRS.RegexWildcard = function( token ) {

    IKRS.RegexSpecialCharacter.call( this, 
				     token, 
				     "WILDCARD[.]" 
				   );

    
};


/**
 * @override
 **/
IKRS.RegexWildcard.prototype.match = function( reader ) {
    
    // Fetch current read mark.
    var beginMark = reader.getMark();


    if( reader.reachedEOI() || reader.available() == 0 ) {
	// Nothing to read
	//reader.read();
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_FAIL,
				       0,      // length is 0
				       beginMark, 
				       reader.getMark() // beginMark
				     ) ]; 
    } else {
	// Read exactly one anonymous symbol
	reader.read();
	return [ new IKRS.MatchResult( IKRS.MatchResult.STATUS_COMPLETE,
				       1,      // length is 1
				       beginMark, 
				       reader.getMark()
				     ) ];
    }
    

};


IKRS.RegexWildcard.prototype.constructor     = IKRS.RegexWildcard;

IKRS.RegexWildcard.prototype.getName         = IKRS.RegexSpecialCharacter.prototype.getName;
IKRS.RegexWildcard.prototype.getValue        = IKRS.RegexSpecialCharacter.prototype.getValue
IKRS.RegexWildcard.prototype.getChildren     = IKRS.RegexSpecialCharacter.prototype.getChildren;
IKRS.RegexWildcard.prototype.getAttributes   = IKRS.RegexSpecialCharacter.prototype.getAttributes;
IKRS.RegexWildcard.prototype.toString        = IKRS.RegexSpecialCharacter.prototype.toString;

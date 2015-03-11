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

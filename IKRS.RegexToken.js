/**
 * A token class.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-06
 * @version 1.0.0
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

IKRS.RegexToken.KLEENESTERN      = "*";     
IKRS.RegexToken.KLEENENOTEMPTY   = "+";
IKRS.RegexToken.OPENINGBRACKET   = "(";
IKRS.RegexToken.CLOSINGBRACKET   = ")";
IKRS.RegexToken.SETSTART         = "[";
IKRS.RegexToken.SETEND           = "]";
IKRS.RegexToken.RANGE            = "-";
IKRS.RegexToken.INTERSECTION     = "&&";
IKRS.RegexToken.UNION            = "|";
IKRS.RegexToken.EXCEPT           = "^";   // Directly after '['
IKRS.RegexToken.BEGIN_OF_INPUT   = "^";   // Anywhere
IKRS.RegexToken.END_OF_INPUT     = "$";
IKRS.RegexToken.ANY_CHARACTER    = ".";




IKRS.RegexToken.prototype.isQuantifyingOperator = function() {
    return ( this.isOperator && 
	     ( this.value == '*' || this.value == '+' || this.value == '{' || this.value == '}' )
	   );
};

IKRS.RegexToken.prototype.isSpecialCharacter = function() {
    return ( !this.isEscaped && 
	     ( this.value == "." || this.value == "^" || this.value == "$" )
	   );
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
    return (this.value == " " || this.value == "\n" || this.value == "\t");
};

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
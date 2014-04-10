/**
 * 0.2
 * 2.0e1
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
			    // isDualOperator,
			    isConstant
			  ) {

    IKRS.Object.call();

    this.value       = value;
    this.rawValue    = rawValue;
    this.isOperator  = isOperator;
    this.isConstant  = isConstant;
};

IKRS.RegexToken.KLEENESTERN      = "*";     
IKRS.RegexToken.KLEENENOTEMPTY   = "+";
IKRS.RegexToken.OPENINGBRACKET   = "(";
IKRS.RegexToken.CLOSINGBRACKET   = ")";
IKRS.RegexToken.SETSTART         = "[";
IKRS.RegexToken.SETEND           = "]";
IKRS.RegexToken.RANGE            = "-";
//IKRS.RegexToken.INTERSECTION     = "&&";
IKRS.RegexToken.UNION            = "|";
IKRS.RegexToken.EXCEPT           = "^";   // Directly after '['
IKRS.RegexToken.BEGIN_OF_INPUT   = "^";   // Anywhere
IKRS.RegexToken.END_OF_INPUT     = "$";


/*
IKRS.RegexToken.prototype.isStronger = function( token ) {

    if( token == null )
	return true;

    if( !this.isOperator ) {
	if( !token.isOperator )            return false;
	else                               return true;   // token is operator; all operators are stronger than non-operators
    } else {
	if( !token.isOperator )            return false;
	else if( this.isSternOperator() )  return token.isSetStartOperator();
	    


	}
    }

};
*/


IKRS.RegexToken.prototype.isSternOperator = function() {
    return ( this.isOperator && 
	     ( this.value == '*' || this.value == '+' || this.value == '{' )
	   );
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
    return "[IKRS.RegexToken]={ value=" + this.value + ", rawValue=" + this.rawValue + ", isOperator=" + this.isOperator + " }";
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

IKRS.RegexToken.isHexadecimalDigitCharacter = function( character ) {

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
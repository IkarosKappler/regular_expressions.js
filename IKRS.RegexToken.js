/**
 * @author Ikaros Kappler
 * @date 2014-04-06
 * @version 1.0.0
 **/


IKRS.RegexToken = function( value, 
			    rawValue,
			    isOperator
			  ) {

    IKRS.Object.call();

    this.value      = value;
    this.rawValue   = rawValue;
    this.isOperator = isOperator;
};

IKRS.RegexToken.KLEENESTERN      = "*";     
IKRS.RegexToken.KLEENENOTEMPTY   = "+";
IKRS.RegexToken.OPENINGBRACKET   = "(";
IKRS.RegexToken.CLOSINGBRACKET   = ")";
IKRS.RegexToken.RANGESTART       = "[";
IKRS.RegexToken.RANGEEND         = "]";
IKRS.RegexToken.RANGE            = "-";
IKRS.RegexToken.INTERSECTION     = "&&";
IKRS.RegexToken.UNION            = "|";
IKRS.RegexToken.EXCEPT           = "^";

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

IKRS.Object.prototype.toString = function() {
    return "[IKRS.RegexToken]={ value=" + this.value + ", rawValue=" + this.rawValue + ", isOperator=" + this.isOperator + " }";
};


IKRS.Object.prototype.contructor = IKRS.RegexToken;
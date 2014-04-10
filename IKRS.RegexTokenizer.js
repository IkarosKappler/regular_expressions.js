/**
 * @author Ikaros Kappler
 * @date 2014-05-08
 * @version 1.0.0
 **/



IKRS.RegexTokenizer = function( pushbackReader ) {

    IKRS.Object.call( this );
    
    this.pushbackReader = pushbackReader;
    this.currentToken   = null;
    
    //this.stack          = [];
};

IKRS.RegexTokenizer.prototype._setCurrentToken = function( token ) {
    this.currentToken = token;
    return token;
};

IKRS.RegexTokenizer.prototype.reachedEOI = function() {
    return (this.currentToken == null);
};

IKRS.RegexTokenizer.prototype.nextToken = function() {

    // Skip whitespace token
    do {
	// Mark the current position to make it possible to
	// unread the last token.
	//this.pushbackReader.mark();
	
	this._nextTokenWhitespaceAllowed();
	
    } while( !this.reachedEOI() && this.currentToken.isWhitespace() );
    return this.currentToken;
};

/*
IKRS.RegexTokenizer.prototype.unreadLastToken = function() {
    this.pushbackReader.reset();
};
*/

IKRS.RegexTokenizer.prototype._nextTokenWhitespaceAllowed = function() {

    var c0 = this.pushbackReader.read();
    if( c0 == -1 )
	return this._setCurrentToken( null );


    if( c0 == '\\' ) {
	
	var c1            = this.pushbackReader.read();
	var constantValue = null;
	if( c1 == '\\' ) {
	    constantValue = '\\';
	} else if( c1 == 'x' ) {
	    // Read two hexadezimal characters
	    if( this.pushbackReader.available() < 2 ) {
		this._setCurrentToken( null );
		throw new Exception( "Hexadezimal character code expected. Found EOI." );
	    }
	    this._setCurrentToken( null );
	    throw new Exception( "Hexadecimal value not yet supported." );
	} else {

	    this._setCurrentToken( null );
	    throw new Exception( "Escaped constant values currently not supported." );

	}
	 
	return this._setCurrentToken( new IKRS.RegexToken( constantValue, constantValue, false, true ) );

    } else if( c0 == '*' || c0 == '+' || c0 == '(' || c0 == ')' || c0 == '[' || c0 ==  ']' || c0 == '|' ) {

	return this._setCurrentToken( new IKRS.RegexToken( c0, c0, true, false ) );   // value, rawValue, is operator, no constant

    } else if( c0 == '-' || c0 == '^' ) {

	return this._setCurrentToken( new IKRS.RegexToken( c0, c0, true, true ) );    // value, rawValue, is operator AND is a constant!

    } else if( c0 == '-' || c0 == '$' ) {

	return this._setCurrentToken( new IKRS.RegexToken( c0, c0, false, true ) );   // value, rawValue, no operator, is a constant!

    } else if( c0 == '&' ) {
	
	// Only double-& is an operator
	var c1 = this.pushbackReader.read();
	if( c1 == '&' ) {
	    return this._setCurrentToken( new IKRS.RegexToken("&&","&&",true,false) ); // value, rawValue, is operator, no constant
	} else {
	    if( c1 != -1 )
		this.pushbackReader.unread(1); // Unread the next token!
	    return this._setCurrentToken( new IKRS.RegexToken(c0, c0, false, true) );  // value, rawValue, no operator, is constant
	}
	    

    } else {

	return this._setCurrentToken( new IKRS.RegexToken( c0, c0, false, true ) );    // value, rawValue, no operator, is constant

    }

};


// x        The character x
// \\        The backslash character
// \0n        The character with octal value 0n (0 <= n <= 7)
// \0nn        The character with octal value 0nn (0 <= n <= 7)
// \0mnn        The character with octal value 0mnn (0 <= m <= 3, 0 <= n <= 7)
// \xhh        The character with hexadecimal value 0xhh
// SLASH uhhhh        The character with hexadecimal value 0xhhhh
// \t        The tab character ('\u0009')
// \n        The newline (line feed) character \u000A
// \r        The carriage-return character \u000D
// \f        The form-feed character ('\u000C')
// ??? \a        The alert (bell) character ('\u0007')
// ??? \e        The escape character ('\u001B')
// ??? \cx        The control character corresponding to x


IKRS.RegexTokenizer.prototype.constructor = IKRS.RegexParser;

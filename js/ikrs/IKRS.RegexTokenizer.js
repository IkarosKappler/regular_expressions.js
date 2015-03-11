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

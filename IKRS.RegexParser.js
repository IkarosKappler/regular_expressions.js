/**
 * @author Ikaros Kappler
 * @date 2014-05-09
 * @version 1.0.0
 **/



IKRS.RegexParser = function( tokenizer ) {

    IKRS.Object.call( this );
    
    this.tokenizer       = tokenizer;    
    this.operatorStack   = [];
    this.operandStack    = [];
    this.currentRegex    = null;
    this.currentOperator = null;
};

/*
IKRS.RegexParser.prototype._pop = function() {
    this.currentRegex = this.operandStack[ this.elementStack.length - 1 ];
};
*/

IKRS.RegexParser.prototype.read = function() {
    // Invariant: on each reading function call the tokenizer 
    //            points onto the _current_ token!
    // So read the first one.
    this.tokenizer.nextToken();
    // Then parse the first regex.
    //this.currentRegex = this._readRegex();
    return this._read();
};

IKRS.RegexParser.prototype._read = function() {

    var last = null; //this.currentRegex; 
    var next = null;
    var result = null;
    while( !this.tokenizer.reachedEOI() && !this.tokenizer.currentToken.isClosingBracketOperator() ) {
	//window.alert( "current token: " + this.tokenizer.currentToken + ", reader=" + this.tokenizer.pushbackReader );
	
	//var last          = next;
	//this.currentRegex = last;
	next          = this._readRegex();	
	if( last != null ) { // && next != null ) {
	    next = new IKRS.RegexConcatenation( last, next );
	    //this.currentRegex = next;
	} 

	var last          = next;
    }

    this.currentRegex = next;
    return this.currentRegex; 
}


IKRS.RegexParser.prototype._readRegex = function() {

    if( this.tokenizer.reachedEOI() ) 
	return null;  // EOI

    //if( this.tokenizer.currentToken.isClosingBracketOperator() )
//	return null;

    
    var operandA = null; // Store directly into currentRegex?
    if( this.tokenizer.currentToken.isConstant ) {	
	operandA = this._readConstant( true );  // Allow '-' here

    } else if( this.tokenizer.currentToken.isOperator ) {
	
	if( this.tokenizer.currentToken.isSternOperator() ) { 
	    // '+', '*' or '{'

	    operandA = this._readKleene();	  

	} else if( this.tokenizer.currentToken.value == "(" ) { 

	    operandA = this._readComposite();

	} else if( this.tokenizer.currentToken.value == ')' ) {
	    
	   return this.currentRegex;

	} else if( this.tokenizer.currentToken.value == "[" ) { 
	    
	    operandA = this._readCharacterSet( false );  // Initially not negated

	} else if( this.tokenizer.currentToken.value == "|" ) {
	    
	    operandA = this._readUnion();
	    
	} else {
	    throw "Unexpected operator: " + this.tokenizer.currentToken.rawValue + " (" + this.tokenizer.currentToken.value + ").";
	}

    } else {

	throw "Symbol " + this.tokenizer.currentToken.rawValue + " is not an operator nor a constant value.";

    }

    
    // There exists exactly one binary operator: UNION
    if( !this.tokenizer.reachedEOI() && this.tokenizer.currentToken.value == "|" ) {
	this.currentRegex = operandA;
	return this._readUnion();
    } else {    
	return operandA;
    }
};

/**
 * Precondition: current token is '*' (or '+' or '{') and there is a predecendent
 *               regex in the buffer.
 **/
IKRS.RegexParser.prototype._readKleene = function( notEmpty ) {

    var notEmpty = (this.tokenizer.currentToken.value == "+");
 
    var lastRegex = this.currentRegex; // this.stack.pop();
    var newRegex  = new IKRS.RegexKleene( lastRegex, 
					  (notEmpty ? 1 : 0),  // At least once?
					  -1                   // No upper bound
					);
    // Consume '*' operator
    this.tokenizer.nextToken(); 
    this.currentRegex = newRegex;
    return newRegex;
};

/**
 * Precondition: current token is '('.
 **/
IKRS.RegexParser.prototype._readComposite = function() {
    
    // Skip '('
    if( this.tokenizer.nextToken() == null )
	throw "Unexpected EOI after '('.";
    
    var result = this.currentRegex;
    while( !this.tokenizer.reachedEOI() && 
	   !this.tokenizer.currentToken.isClosingBracketOperator() 
	 ) {

	var result = this._read();
	
    }
    
    if( this.tokenizer.reachedEOI() )
	throw "EOI reached where ')' is expected.";

    if( !this.tokenizer.currentToken.isClosingBracketOperator() ) 
	throw "Unexpected token '" + this.tokenizer.currentToken.value + "' where operator ')' is expected.";
    
    this.tokenizer.nextToken(); 
    // Composite directly followed by stern?
    if( !this.tokenizer.reachedEOI() && this.tokenizer.currentToken.isSternOperator() )
	return this._readKleene(); // this.tokenizer.currentToken.value != "*" );
    else
	return result; 
};

/**
 * Precondition: current token is '['.
 **/
IKRS.RegexParser.prototype._readCharacterSet = function( p_negate ) {
    
    // Safety check for recursive calls :)
    if( this.tokenizer.reachedEOI() )
	throw "Cannot read character set. Operator '[' expected, found instead: EOI.";
    if( !this.tokenizer.currentToken.isSetStartOperator() )
	throw "Cannot read character set. Operator '[' expected, found instead: '" + this.tokenizer.currentToken.value + "'.";




    // Each range must consist of at least three characters:
    //  - start character
    //  - range symbol '-'
    //  - end character
    
    var i                    = 0;
    var negate               = p_negate; // false;
    var        t0            = this.tokenizer.nextToken();
    if( t0 == null ) 
	throw "EOI reached but character set definition expected.";
    if( t0.isExceptOperator() ) {
	negate = !negate; //true;
	t0     = this.tokenizer.nextToken();
    }
    var        t1            = null;
    var characters           = [];
    var ranges               = [];
    var parentUnion          = new IKRS.RegexUnion( null, null );
    var optionalIntersection = null; // Will be initialized when '&&' is read
    var endOfSetReached      = false;
    while( optionalIntersection == null  &&  // intersections are nested, so only one is allowed
	   !endOfSetReached &&
	   (t1 = this.tokenizer.nextToken()) != null && 
	   (t0 == null || !t0.isSetEndOperator())
	 ) {
   
	if( t0 == null ) {
	    
	    // First loop run
	    
	//} else if( t0.isSetEndOperator() ) {

	//    endOfSetReached = true;

	} else if( t0.isOperator ) { // t0.isExceptOperator() ) {

	    // The negation is only allowed at the first position, which was 
	    // already read BEFORE the loop.
	    // Other operators arent fine allowed here, too.
	    throw "Operator '" + t0.value + "' not allowed here.";


	/*} else if( t0.isAndOperator() ) {	
	
	    if( i == 0 || (i == 1 && negate) ) {

		throw "Character value(s) expected before AND operator '" + t0.value + "'."; 
		
	    } else {

		// Next token after '&&' must be a new character set
		// (Note that the next token was already read for c1).
		optionalIntersection = this._readCharacterSet();

		// Restore consistent stat (this makes error handling easier)
		//t1 = this.tokenizer.nextToken(); //this.tokenizer.currentToken; 

	    } 
		
*/
	//} else if( t0.isOperator ) {
//
//	    throw "Operator '" + t0.value + "' not allowed here.";



	} else if( t1.isRangeOperator() ) { 
	    // - t1 is the range operator '-'
	    // - t0 is a character
	    // - t2 must be present and also a character!
	    var t2 = this.tokenizer.nextToken();
	    if( t2 == null )
		throw "Unexpected EOI after range operator '" + t1.value + "'.";
	    if( t2.isOperator )
		throw "Constant value expected after range operator '" + t1.value + "'. Found instead '" + t2.value +"' (operator).";
	    var tmpRange = new IKRS.RegexCharacterRange( negate,
						         new IKRS.RegexCharacter(t0.value, t0.characterCode, t0.rawValue),
							 new IKRS.RegexCharacter(t2.value, t2.characterCode, t2.rawValue)
						       );
	    //window.alert( "tmpRange=" + tmpRange.toString() );
	    ranges.push( tmpRange );
	    parentUnion.children.push( tmpRange );

	    // Skip operator in next turn!
	    t1 = this.tokenizer.nextToken();
	    //t0 = t1;
	    //t1 = t2;

	} else {
	    
	    // t1 is no operator 
	    //  -> will be the next t0 constant in a regular loop turn.
	    var tmpChar = new IKRS.RegexCharacter( t0.value,
						   t0.characterCode,  // NOT YET AVAILABLE!
						   t0.rawValue
						 );
	    //window.alert( "tmpChar=" + tmpChar.toString() );
	    characters.push( tmpChar );
	    parentUnion.children.push( tmpChar );
	
	    
	}


	// Next check: INTERSECTION?
	if( t1.isAndOperator() ) {	
	    
	    // Next token after '&&' must be a new character set
	    // (Note that the next token was already read for t1).

	    // But first: consume '&&'
	    this.tokenizer.nextToken();
	    optionalIntersection = this._readCharacterSet( negate ); // inherit negation sub set? What's the definition???
	    
	    // Restore consistent stat (this makes error handling easier)
	    t1 = this.tokenizer.currentToken; 

	} 
	
	// Might be t1 from this loop OR from the recursive function call!
	if( t1.isSetEndOperator() ) {

	    // This will indicate that the ']' was already read (important for nested sets).
	    // The token will NOT be consumed later then.
	    endOfSetReached = true;

	}


	t0 = t1;
	i++;

    } // END while
    
    

    // Empty set really not allowed?
    if( parentUnion.children.length == 0 )
	throw "Empty character set not allowed.";

    var finalRegex = null;
    if( parentUnion.children.length == 1 ) finalRegex = parentUnion.children[0];
    else                                   finalRegex = parentUnion;
	
    
    // Was a nest intersection child found?
    if( optionalIntersection != null )
	finalRegex = new IKRS.RegexIntersection( finalRegex, optionalIntersection );

    
    // Loop terminated. End of set reached?
    if( t0 == null )
	throw "EOI reached where end-of-set ']' is expected.";
    if( !t0.isSetEndOperator() ) 
	throw "Unexpected token '" + t1.value + "' reached, where end-of-set ']' is expected.";
    
    // Consume ']' token
    this.tokenizer.nextToken();


    // window.alert( "ranges.length=" + ranges.length + ", characters.length=" + characters.length + ", ranges=" + array2string(ranges) + ", characters=" + array2string(characters) + ", finalRegex=" + finalRegex );


    this.currentRegex = finalRegex;
    return this.currentRegex;
};

/**
 * Precondition: current token is '|' and in this.currentRegex is the
 *               left operand.
 **/  
IKRS.RegexParser.prototype._readUnion = function() {

    // The current token is '|'.
    // So switch to the next token, then read the next regex, then 
    // construct a UNION regex.  
    if( this.tokenizer.nextToken() == null )
	throw "Unexpected EOI after union operator '|'.";

    // Take the last regex
    var lastRegex = this.currentRegex;
    // Parse the next regex
    var nextRegex = this._read(); //this._readRegex();

    var union = new IKRS.RegexUnion(lastRegex,nextRegex);
    this.currentRegex = union;

    return union;
};

IKRS.RegexParser.prototype._readConstant = function( allowDashAsConstant ) {
    
    //window.alert( "BEGIN_OF_CONSTANT=" + this.tokenizer.currentToken.value );

    // Append the current token.
    // It already belongs to the constant (first character).
    var stringBuffer = new IKRS.StringBuffer( this.tokenizer.currentToken.value );
    while( this.tokenizer.nextToken() != null &&
	   this.tokenizer.currentToken.isConstant && 
	   (allowDashAsConstant || this.tokenizer.currentToken.value != '-') 
	 ) {

	stringBuffer.append( this.tokenizer.currentToken.value  );
    };
	   
    this.currentRegex = new IKRS.RegexConstant(stringBuffer.toString());

    // Note that the STERN operators bind STRONGER than any other operator!
    while( !this.tokenizer.reachedEOI() && this.tokenizer.currentToken.isSternOperator() ) { //
	/*this.tokenizer.currentToken != null &&
	   this.tokenizer.currentToken.isOperator &&
	   this.tokenizer.currentToken.isSternOperator() ) {
*/	

	this._read(); // this._readRegex();
    }

    // Is UNION following?
    // ...

    return this.currentRegex;
};



IKRS.RegexParser.prototype.constructor = IKRS.RegexParser;

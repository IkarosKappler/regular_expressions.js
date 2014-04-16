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


IKRS.RegexParser.prototype.parse = function() {
    // Clear warnings from last run
    this.warnings        = [];

    // So read the first one.
    this.tokenizer.nextToken();

    // Then parse the first regex.
    return this.regex();
};

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

IKRS.RegexParser.prototype.base = function() {
    
    if( this.tokenizer.currentToken.isOpeningBracketOperator() ) {
	
	// Next token might be '?'
	if( this.tokenizer.peek() != null &&
	    !this.tokenizer.peek().isEscaped &&
	    this.tokenizer.peek().value == '?' ) {

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

	// Old Version (working, but ugly tree)
	//var constant =  new IKRS.RegexCharacter( this.tokenizer.currentToken );
	//this.tokenizer.nextToken();
	//return constant;
	
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
		
		concatRegex.addRegex( IKRS.RegexSpecialCharacter.createFromToken(this.tokenizer.currentToken) ); //new IKRS.RegexSpecialCharacter(this.tokenizer.currentToken) );

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
 * Precondition: current token is '*' (or '+' or '{') and there is a predecendent
 *               regex in the buffer.
 **/
IKRS.RegexParser.prototype._readQuantifyingRule = function( baseRegex ) {

    var minCount         = 0;
    var maxCount         = Number.POSITIVE_INFINITY;
    var knownAttributes  = 0;
    
    if( this.tokenizer.currentToken.isSternOperator() ) {
	maxCount = Number.POSITIVE_INFINITY;
    } else if( this.tokenizer.currentToken.isPlusOperator() ) {
	minCount = 1;
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


	    var tmpChar = new IKRS.RegexCharacter( t0 ); 
	    characters.push( t0 ); 
	
	    
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

IKRS.RegexParser.prototype._throwParseException = function( errmsg ) {
    throw new IKRS.ParseException( errmsg,
				   this.tokenizer.pushbackReader.position,
				   this.tokenizer.pushbackReader.position+1
				 );
};


IKRS.RegexParser.prototype.constructor = IKRS.RegexParser;

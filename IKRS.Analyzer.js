/**
 * An Analyzer keeps an array of named regular expressions (objects with a 'match' function)
 * and is capable to split input strings into token sequences.
 * Each returned token is named by its matching regular expression.
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

IKRS.Analyzer.prototype.nextMatch = function( reader, keepFirstMatch ) {
    
    // Fetch reader position mark
    var beginMark           = reader.getMark();
    
    //var STOP_AT_FIRST_MATCH = true;
    var longestMatchList    = [];
    // Try token by token and detect the longest match for each.
    // Collect the longest matches.
    var longestMatchCount   = 0;
    for( var i = 0; i < this.rules.length && (!keepFirstMatch || longestMatchCount == 0); i++ ) {

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
	reader.resetTo( beginMark );
	var buffer = [];
	var i      = longestMatch.matchLength;
	var c      = -1;
	while( i > 0 && (c = reader.read()) != -1 ) {
	    buffer.push( c );
	    i--;
	}
	
	this.rules[index].action( this.rules[index].name,   // rule.name
				  buffer.join(""),          // value
				  longestMatch,
				  this.rules[index].callbackParams
				);
	
	//window.alert( "Returning: " + longestMatch );
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


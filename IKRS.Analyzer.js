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

    
    this.rules = [];
};


/**
 * @throws IKRS.ParseException
 **/
IKRS.Analyzer.prototype.addRuleByString = function( name, regexString ) {

    var parser = new IKRS.RegexParser( new IKRS.RegexTokenizer( new IKRS.PushbackStringReader(regexString) ) );
    var regex  = parser.read();  // may throw ParseException
    
    return this.addRule( name, regex );

};

IKRS.Analyzer.prototype.addRule = function( name, regex ) {
    // ...
};


/**
 * Ecpects and array of MatchResult elements and returns the longest match
 * with the smallest index.
 **/
IKRS.Analyzer._getLongestMatch = function( matchResult ) {
    var index  = IKRS.Analyzer._locateLongestMatch( matchResult );
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
IKRS.Analyzer._locateLongestMatch = function( matchResult ) {
    var index  = -1;
    var length = -1;
    for( var i = 0; i < matchResult.length; i++ ) {
	if( matchResult[i].matchStatus == IKRS.MatchResult.STATUS_COMPLETE && matchResult[i].matchLength > length ) {
	    index  = i;
	    length = matchResult[i].matchLength;
	}
    }
    
    return index;
}


IKRS.Analyzer.prototype.constructor = IKRS.Analyzer;


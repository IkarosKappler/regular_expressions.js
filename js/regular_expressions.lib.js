/**
 * @author Ikaros Kappler
 * @date 2014-04-16
 * @version 1.0.0
 **/


var files =  [
    "js/ikrs/IKRS.js",
    "js/ikrs/IKRS.Object.js",
    "js/ikrs/IKRS.ArraySet.js",
    "js/ikrs/IKRS.RegexAttribute.js",
    "js/ikrs/IKRS.Pattern.js",
    "js/ikrs/IKRS.PushbackStringReader.js",
    "js/ikrs/IKRS.StringBuffer.js",
    "js/ikrs/IKRS.RegexToken.js",
    "js/ikrs/IKRS.RegexTokenizer.js",
    "js/ikrs/IKRS.RegexParser.js",
    "js/ikrs/IKRS.TokenSequence.js",
    "js/ikrs/IKRS.ParseException.js",
    "js/ikrs/IKRS.MatchResult.js",
    "js/ikrs/IKRS.Analyzer.js",

// <!-- These classes inherit from IKRS.Pattern -->
    "js/ikrs/IKRS.RegexConstant.js",
    "js/ikrs/IKRS.RegexUnion.js",
    "js/ikrs/IKRS.RegexIntersection.js",
    "js/ikrs/IKRS.RegexQuantifyer.js",
    "js/ikrs/IKRS.RegexConcatenation.js",
    "js/ikrs/IKRS.RegexCharacter.js",
    "js/ikrs/IKRS.RegexCharacterSet.js",
    "js/ikrs/IKRS.RegexCharacterRange.js",
    "js/ikrs/IKRS.RegexSpecialCharacter.js",

// <!-- Predefined character classes (inherit from IKRS.RegexSpecialCharacter) -->
    "js/ikrs/IKRS.RegexWhitespace.js",
    "js/ikrs/IKRS.RegexDigit.js",
    "js/ikrs/IKRS.RegexWord.js",
    "js/ikrs/IKRS.RegexBeginOfInput.js",
    "js/ikrs/IKRS.RegexEndOfInput.js",
    "js/ikrs/IKRS.RegexWildcard.js"
];

function dependentLoad( fileNames, index ) {

    var next = index+1;
    //window.alert( "Adding " + files[i] );
    var fileref = document.createElement('script');
    if( next < fileNames.length )
	fileref.onload = function( e ) { dependentLoad( fileNames, next ); }; 

    fileref.setAttribute( "type","text/javascript" );
    fileref.setAttribute( "src", fileNames[index]);
    document.getElementsByTagName("head")[0].appendChild(fileref)

}

dependentLoad( files, 0 );


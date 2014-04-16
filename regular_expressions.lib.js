/**
 * @author Ikaros Kappler
 * @date 2014-04-16
 * @version 1.0.0
 **/


var files =  [
    "IKRS.js",
    "IKRS.Object.js",
    "IKRS.RegexAttribute.js",
    "IKRS.Pattern.js",
    "IKRS.PushbackStringReader.js",
    "IKRS.StringBuffer.js",
    "IKRS.RegexToken.js",
    "IKRS.RegexTokenizer.js",
    "IKRS.RegexParser.js",
    "IKRS.TokenSequence.js",
    "IKRS.ParseException.js",
    "IKRS.MatchResult.js",

// <!-- These classes inherit from IKRS.Pattern -->
    "IKRS.RegexConstant.js",
    "IKRS.RegexUnion.js",
    "IKRS.RegexIntersection.js",
    "IKRS.RegexQuantifyer.js",
    "IKRS.RegexConcatenation.js",
    "IKRS.RegexCharacter.js",
    "IKRS.RegexCharacterSet.js",
    "IKRS.RegexCharacterRange.js",
    "IKRS.RegexSpecialCharacter.js",

// <!-- Predefined character classes (inherit from IKRS.RegexSpecialCharacter) -->
    "IKRS.RegexWhitespace.js",
    "IKRS.RegexDigit.js",
    "IKRS.RegexWord.js",
    "IKRS.RegexBeginOfInput.js",
    "IKRS.RegexEndOfInput.js",
    "IKRS.RegexWildcard.js"
];

for( var i = 0; i < files.length; i++ ) {
    //window.alert( "Adding " + files[i] );
    var fileref = document.createElement('script');
    fileref.setAttribute( "type","text/javascript" );
    fileref.setAttribute( "src", files[i]);
    document.getElementsByTagName("head")[0].appendChild(fileref)
}
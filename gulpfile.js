
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var del = require('del');

//script paths
var jsFiles = [
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
    ],
    jsDest = './dist/',
    concatFilename = 'regular_expressions.js';

gulp.task('clean', function() {
    return Promise.all([
        del('regular_expressions.js'),
        del('regular_expressions.min.js')
    ]);
});

gulp.task('concat', function() {
    return gulp.src(jsFiles)
        .pipe(concat(concatFilename))
        .pipe(gulp.dest(jsDest));
});

gulp.task('uglify', function() {
    return gulp.src(jsDest+concatFilename)
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(jsDest));
});

gulp.task('default', function() {
    return runSequence( 'clean', 'concat', 'uglify' ); 
});



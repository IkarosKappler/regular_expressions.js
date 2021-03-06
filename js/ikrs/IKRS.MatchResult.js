/**
 * @author Ikaros Kappler
 * @date 2014-04-13
 * @version 1.0.0
 **/

IKRS.MatchResult = function( matchStatus,
			     //matchStart,
			     matchLength,
			     
			     beginMark,
			     endMark
			   ) {

    IKRS.Object.call( this );

    this.matchStatus = matchStatus;
    //this.matchStart  = matchStart;
    this.matchLength = matchLength;
    
    this.beginMark   = beginMark;
    this.endMark     = endMark;

};

IKRS.MatchResult.STATUS_COMPLETE   = 0;
//IKRS.MatchResult.STATUS_INCOMPLETE = 1;
IKRS.MatchResult.STATUS_FAIL       = 1;

IKRS.MatchResult.status2name = function( statusID ) {
    switch( statusID ) {
    case IKRS.MatchResult.STATUS_COMPLETE:   return "COMPLETE";
    //case IKRS.MatchResult.STATUS_INCOMPLETE: return "INCOMLETE";
    case IKRS.MatchResult.STATUS_FAIL:       return "FAIL";
    default:                                 return "UNKNOWN(" + statusID + ")";
    }
};

IKRS.MatchResult.prototype.toString = function() {
    return "[IKRS.MatchResult]={" +
	" matchStatus=" + IKRS.MatchResult.status2name(this.matchStatus) + 
	//", matchStart=" + this.matchStart + 
	", matchLength=" + this.matchLength + 
	", matchBeginPosition=" + this.beginMark.position + 
	", matchEndPosition=" + this.endMark.position +
	" }";
};

IKRS.MatchResult.prototype.constructor = IKRS.MatchResult;

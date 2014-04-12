/**
 * A generic parse exception class.
 *
 * @author Ikaros Kappler
 * @date 2014-04-12
 * @version 1.0.0
 **/

IKRS.ParseException = function( errorMessage,
				startOffset,
				endOffset
			      ) {

    IKRS.Object.call( this );
    
    this.errorMessage = errorMessage;
    this.startOffset  = startOffset;
    this.endOffset    = endOffset;

};



IKRS.ParseException.prototype.constructor = IKRS.ParseException;


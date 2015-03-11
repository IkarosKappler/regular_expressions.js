/**
 * The super class for all IKRS.Regex* classes.
 *
 *
 * @author Ikaros Kappler
 * @date 2014-04-10
 * @version 1.0.0
 **/


IKRS.Pattern = function( name ) {

    IKRS.Object.call( this );
    
    this.name       = name;
    this.children   = [];
    this.value      = null;    // Leaf notes have values
    this.attributes = [];
};


IKRS.Pattern.prototype.getName = function() {
    return this.name;
};

IKRS.Pattern.prototype.getValue = function() {
    return this.value;
};

/*
IKRS.Pattern.prototype.getChildCount = function() {
    return this.children.length;
};

IKRS.Pattern.prototype.getChildAt = function( index ) {
    return this.children[ index ];
};
*/

IKRS.Pattern.prototype.getChildren = function() {
    return this.children;
};

IKRS.Pattern.prototype.getAttributes = function() {
    return this.attributes;
};

IKRS.Pattern.prototype.constructor = IKRS.Pattern;
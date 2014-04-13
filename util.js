/**
 * @author Ikaros Kappler
 * @date 2014-04-10
 **/

function loadPreset( preset ) {

    if( document.getElementById("concat_presets").checked )
	document.getElementById('input_regex').value += preset;
    else
	document.getElementById('input_regex').value = preset;

}

function array2string( arr ) {

    var str = "[";

    for( var i = 0; i < arr.length; i++ ) {
	
	if( i == 0 )
	    str += " ";
	else
	    str += ", ";

	if( arr[i] == null )	    
	    str += arr[i];
	else
	    str += arr[i].toString();

    }

    if( arr.length > 0)
	str += " ";

    str += "]";

    return str;
}

function pattern2string( pattern, indent ) {
    
    if( indent == null )
	indent = "";

    if( pattern == null )
	return "null";

    var str = ""; 
    //window.alert( (typeof pattern) );
    //if( !pattern.getName )
//	return pattern;
    str += indent + pattern.getName() + "\n";
    if( pattern.children.length > 0 ) {
	//str += indent + " [children]\n";
	for( var i = 0; i < pattern.children.length; i++ ) {
	    str += pattern2string( pattern.children[i], 
				   indent + "      " 
				 );
	}
    }
    
    return str;

}
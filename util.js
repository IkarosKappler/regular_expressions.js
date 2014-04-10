
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

/**
 * @author Ikaros Kappler
 * @date 2014-04-05
 * @version 1.0.0
 **/

function testPushbackStringReader() {
    
    //window.alert( "X" );

    var stringData = document.getElementById( "input_text" ).value;
    
    var pbr        = new IKRS.PushbackStringReader( stringData,
						    0,
						    stringData.length
						  );
    
    window.alert( pbr );
    
    var i = 0;
    var stat = pbr.read();
    window.alert( "First character read: " + stat + "; unread(1)" );
    pbr.unread( 1 );
    
    //window.alert( stat );
    while( i < 10 && (stat = pbr.read()) != -1 ) {

	window.alert( "[" + i + "] position=" + pbr.getPosition() + ", line=" + pbr.getLineNumber() + ", col=" + pbr.getColumnNumber() + ", char=" + pbr.getCurrentCharacter() + ", charCode=" + pbr.getCurrentCharacterCode() );

	i++;
    }
    
    pbr.unread(1);

    while( (stat = pbr.read()) != -1 ) {

	window.alert( "[" + i + "] position=" + pbr.getPosition() + ", line=" + pbr.getLineNumber() + ", col=" + pbr.getColumnNumber() + ", char=" + pbr.getCurrentCharacter() + ", charCode=" + pbr.getCurrentCharacterCode() );

	i++;
    }
}

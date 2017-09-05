var SESSIONINFO = $.import("com.sap.sapmentors.sitreg.lib", "session");

function participantUpdate(param){
    $.trace.debug('entered function participantUpdate');  
    
	var currentUser = $.session.getUsername().toUpperCase();
    let after = param.afterTableName; // Temp Table

	var	pStmt = param.connection.prepareStatement('SELECT * FROM "' + after + '"');	 
	var result = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), "entity");
	var participant = result.entity[0];
    $.trace.debug(currentUser + ": " + JSON.stringify(participant));
	pStmt.close();
	
}
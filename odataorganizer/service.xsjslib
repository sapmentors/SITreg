function EventsCreateBefore(param){
    $.trace.debug('entered function');
    let after = param.afterTableName; // temporary table
    // Updating Employee Id Before Create operation via sequence
    let pStmt = param.connection.prepareStatement(
        'UPDATE "' + after + 
        '" set "ID" = "com.sap.sapmentors.sitreg.data::eventId".NEXTVAL' 
    );
    pStmt.executeUpdate();
    pStmt.close();
}
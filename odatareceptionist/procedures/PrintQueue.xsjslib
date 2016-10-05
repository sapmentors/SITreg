function PrintQueueUpdate(param){ 
    $.trace.debug('entered function PrintQueueUpdate'); 
    // let before = param.beforeTableName;
    let after = param.afterTableName;
    // Update PrintQueue
    let pStmt = param.connection.prepareStatement('SELECT * FROM "' + after + '"' ); 
    let rs = pStmt.executeQuery();
    if (rs.next()) {
        var TicketUsed = rs.getNString(4);
    }
    $.trace.debug('TicketUsed: ' + TicketUsed); 
    $.trace.debug('leave function PrintQueueUpdate'); 
} 
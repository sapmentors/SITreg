function readParticipant(_ParticipantID) {
    var conn;
    var participant = {};
    
    try {
        conn = $.db.getConnection();
        var select = 'SELECT "ID", "EventID", "FirstName", "LastName", "Twitter"'
            + ' FROM "com.sap.sapmentors.sitreg.data::SITreg.Participant"'
            + ' WHERE "ID" = ?';
        var pStmt = conn.prepareStatement(select);
        pStmt.setInteger(1, _ParticipantID);
        var rs = pStmt.executeQuery();
        if (rs.next()) {
            participant.ParticipantID = rs.getInteger(1);
            participant.EventID       = rs.getInteger(2);
            participant.FirstName     = rs.getNString(3);
            participant.LastName      = rs.getNString(4);
            participant.Twitter       = rs.getNString(5);
        }
        rs.close();
        pStmt.close();
        conn.close();
    } catch (e) {
        participant.error = "Error: exception caught: <br />" + e.toString();
    }   
    return participant;
}

function isParticipantInPrintQueue(_ParticipantID) {
    var conn;
    var count;
    try {
        conn = $.db.getConnection();
        var select = 'SELECT COUNT("ParticipantID") AS count '
            + 'FROM "com.sap.sapmentors.sitreg.data::SITreg.PrintQueue" '
            + 'WHERE "ParticipantID" = ?';
        var pStmt = conn.prepareStatement(select);
        pStmt.setInteger(1, _ParticipantID);
        var rs = pStmt.executeQuery();
        if (rs.next()) {
            count = rs.getInteger(1);
        }
        pStmt.close();
    } catch (e) {
        $.trace.debug("Error: exception caught: <br />" + e.toString());
    }
    if(count === 0) {
        return false;
    } else {
        return true;
    }
}

function getDevicesForEvent(_EventID) {
    var conn;
    var devices = [];
    try {
        conn = $.db.getConnection();
        var select = 'SELECT "DeviceID" '
            + 'FROM "com.sap.sapmentors.sitreg.data::SITreg.Device" '
            + 'WHERE "EventID" = ?';
        var pStmt = conn.prepareStatement(select);
        pStmt.setInteger(1, _EventID);
        var rs = pStmt.executeQuery();
        if (rs.next()) {
            devices.push(rs.getString(1));
        }
        pStmt.close();
    } catch (e) {
        $.trace.debug("Error: exception caught: <br />" + e.toString());
    }
    return devices;
}

function addParticipantToPrintQueue(_participant) {
    var conn;
    var status = {};
    try {
        var devices = getDevicesForEvent(_participant.EventID);
        if(!isParticipantInPrintQueue(_participant.EventID)) {
            conn = $.db.getConnection();
            var select = 'INSERT INTO "com.sap.sapmentors.sitreg.data::SITreg.PrintQueue" '
        	    + 'VALUES(?, ?, ?, ?, ?, ?, ' 
        	    + 'CURRENT_USER, CURRENT_TIMESTAMP, CURRENT_USER, CURRENT_TIMESTAMP )';
            var pStmt = conn.prepareStatement(select);
            pStmt.setInteger(1, _participant.ParticipantID);
            pStmt.setInteger(2, _participant.EventID);
            pStmt.setString(3,  _participant.FirstName);
            pStmt.setString(4,  _participant.LastName);
            if(!_participant.Twitter) {
                _participant.Twitter = "";
            }
            pStmt.setString(5,  _participant.Twitter);
            pStmt.setString(6,  _participant.PrintStatus);
            pStmt.executeUpdate();
            conn.commit(); 
            pStmt.close();
        } else {
            status.error = "Entry does already exist";
        }
        conn.close();
    } catch (e) {
        status.error = "Error: exception caught: <br />" + e.toString();
    }   
    return status;    
}

function PrintQueueUpdateAfterTicketUpdate(param){ 
    $.trace.debug('entered function PrintQueueUpdate'); 
    // let before = param.beforeTableName;
    let after = param.afterTableName;
    // Update PrintQueue
    let pStmt = param.connection.prepareStatement('SELECT * FROM "' + after + '"' ); 
    let rs = pStmt.executeQuery();
    if (rs.next()) {
        var ParticipantID = rs.getNString(1);
        var TicketUsed = rs.getNString(4);
    }
    $.trace.debug('ParticipantID:' + ParticipantID + 'TicketUsed: ' + TicketUsed); 
    // var participant = readParticipant(ParticipantID);
    rs.close();
    pStmt.close();
    $.trace.debug('leave function PrintQueueUpdate'); 
}

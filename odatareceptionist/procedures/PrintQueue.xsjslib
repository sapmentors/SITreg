function readParticipant(_ParticipantID) {
    var conn;
    var participant = {};
    
    try {
        conn = $.db.getConnection();
        var select = 'SELECT "ID", "EventID", "FirstName", "LastName", "Twitter"'
            + ' FROM "com.sap.sapmentors.sitreg.odataparticipant.procedures::ParticipantsRead"'
            + ' WHERE "ID" = ?';
        var pStmt = conn.prepareStatement(select);
        pStmt.setInteger(1, parseInt(_ParticipantID));
        var rs = pStmt.executeQuery();
        if (rs.next()) {
            participant.ParticipantID = rs.getInteger(1);
            participant.EventID       = rs.getInteger(2);
            participant.FirstName     = rs.getNString(3);
            participant.LastName      = rs.getNString(4);
            participant.Twitter       = rs.getNString(5);
        }
        if(!participant.Twitter) {
            participant.Twitter = "";
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
    $.trace.debug("Devices: " + JSON.stringify(devices));
    return devices;
}

function hasPrintQueueElementInSentStatusForEvent(_EventID) {
    var conn;
    var count;
    try {
        conn = $.db.getConnection();
        var select = 'SELECT COUNT("ParticipantID") AS count '
            + 'FROM "com.sap.sapmentors.sitreg.data::SITreg.PrintQueue" '
            + 'WHERE "EventID" = ? AND "PrintStatus" = ' + "'S'";
        var pStmt = conn.prepareStatement(select);
        pStmt.setInteger(1, _EventID);
        var rs = pStmt.executeQuery();
        if (rs.next()) {
            count = rs.getInteger(1);
        }
        pStmt.close();
    } catch (e) {
        $.trace.debug("Error: exception caught: <br />" + e.toString());
    }
    if(count > 0) {
        return true;
    } else {
        return false;
    } 
}

function sendParticipantToDevice(_participant, _devices) {
    var destination_package = "com.sap.sapmentors.sitreg.odatareceptionist.procedures";
    var destination_name = "hcpiotmms";
    var status = {};
 
    var dest = $.net.http.readDestination(destination_package, destination_name);
    var client = new $.net.http.Client();
    for (var i = 0; i < _devices.length; i++) {
        try {
          var req = new $.web.WebRequest($.net.http.POST, _devices[i]);
          req.headers.set('Content-Type', encodeURIComponent("application/json"));
          var bodyJSON = {
              "messageType":"e831c7faaf5cd1091161",
              "messages":[
                  {
                    "timestamp": Math.round(new Date().getTime()/1000),
                    "ID": _participant.ParticipantID,
                    "EventID": _participant.EventID,
                    "FirstName": _participant.FirstName,
                    "LastName": _participant.LastName,
                    "Twitter": _participant.Twitter
                  }
              ],
              "method":"ws","sender":"IoT App"
          };
          req.setBody(JSON.stringify(bodyJSON));
         
          client.request(req, dest);
          var response = client.getResponse();
          status.status = response.status;
          status.body = response.body.asString();
          // status.DeviceID = _devices[i];
        } catch (e) {
          status.error = e.message;
        }
    }
    return status;
}

function addParticipantToPrintQueue(_participant) {
    var conn;
    var status = {};
    try {
        var devices = getDevicesForEvent(_participant.EventID);
        if(devices.length > 0) {
            $.trace.debug('addParticipantToPrintQueue: Devices are available');
            if(!isParticipantInPrintQueue(_participant.EventID)) {
                if (hasPrintQueueElementInSentStatusForEvent(_participant.EventID)) {
                    _participant.PrintStatus = 'Q';
                } else {
                    _participant.PrintStatus = 'S';
                }
                $.trace.debug('PrintStatus: ' + _participant.PrintStatus);
                conn = $.db.getConnection();
                var select = 'INSERT INTO "com.sap.sapmentors.sitreg.data::SITreg.PrintQueue" '
            	    + 'VALUES(?, ?, ?, ?, ?, ?, ' 
            	    + 'CURRENT_USER, CURRENT_TIMESTAMP, CURRENT_USER, CURRENT_TIMESTAMP )';
                var pStmt = conn.prepareStatement(select);
                pStmt.setInteger(1, _participant.ParticipantID);
                pStmt.setInteger(2, _participant.EventID);
                pStmt.setString(3,  _participant.FirstName);
                pStmt.setString(4,  _participant.LastName);
                pStmt.setString(5,  _participant.Twitter);
                pStmt.setString(6,  _participant.PrintStatus);
                pStmt.executeUpdate();
                conn.commit(); 
                pStmt.close();
                status.toDevice = sendParticipantToDevice(_participant,devices);
                if (_participant.PrintStatus === 'S') {
                    // Use Queueing later
                }
            } else {
                status.error = "Entry does already exist";
            }
            conn.close();
        } else {
            status.error = "No Devices found for Event";
        }
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
        var TicketUsed = rs.getNString(3);
    }
    $.trace.debug('ParticipantID:' + ParticipantID + 'TicketUsed: ' + TicketUsed);
    if(TicketUsed === 'N' || TicketUsed === 'M') {
        $.trace.debug('Call of readParticipant');
        var participant = readParticipant(ParticipantID);
        $.trace.debug('Participant: ' + JSON.stringify(participant));
        $.trace.debug('Call of addParticipantToPrintQueue');
        var status = addParticipantToPrintQueue(participant);
        $.trace.debug('Status: ' + JSON.stringify(status));
    }
    rs.close();
    pStmt.close();
    $.trace.debug('leave function PrintQueueUpdate'); 
}

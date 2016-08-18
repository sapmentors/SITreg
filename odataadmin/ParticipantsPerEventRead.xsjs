/*

   Copyright 2016 SAP Mentors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

function ParticipantsPerEventRead() {
    var body;
    var conn;
    var firstResult = true;
    $.response.status = $.net.http.OK;
    $.response.contentType = "application/json";
    try {
        conn = $.db.getConnection("com.sap.sapmentors.sitreg.odataadmin::private");
        var pStmt = conn.prepareStatement('SELECT "ID", "Location", "EventDate", "StartTime", "EndTime", "MaxParticipants", "HomepageURL" FROM "com.sap.sapmentors.sitreg.data::SITreg.Event"');
        var rs = pStmt.executeQuery();
        var json = "[";
        while (rs.next()) {
            if(firstResult){
                firstResult = false;
            } else {
                json += ',';
            }
            json += '{ '
                    + '"ID": '              + JSON.stringify(rs.getNString(1)) + ', '
                    + '"Location": '        + JSON.stringify(rs.getNString(2)) + ','
                    + '"EventDate": '       + JSON.stringify(rs.getNString(3)) + ','
                    + '"StartTime": '       + JSON.stringify(rs.getNString(4)) + ','
                    + '"EndTime": '         + JSON.stringify(rs.getNString(5)) + ','
                    + '"MaxParticipants": ' + JSON.stringify(rs.getNString(6)) + ','
                    + '"HomepageURL": '     + JSON.stringify(rs.getNString(7)) + ''
                    + '}';
        }
        json += "]";
        body = json;
        rs.close();
        pStmt.close();
    } catch (e) {
        body = "Error: exception caught: <br />" + e.toString();
        $.response.status = $.net.http.BAD_REQUEST;
    }
    if (conn) {
        conn.close();
    }
    $.response.setBody( body );
}
ParticipantsPerEventRead();
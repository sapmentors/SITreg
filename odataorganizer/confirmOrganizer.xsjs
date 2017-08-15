/*

   Copyright 2016 Gregor Wolf

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

var XSDS = $.import("sap.hana.xs.libs.dbutils", "xsds");

function confirmOrganizer() {
    var body;
    var conn;
    $.response.status = $.net.http.OK;
    $.response.contentType = "application/json";
    try {
        var UserName = "";
        if($.request.method === $.net.http.GET) {
            UserName = decodeURIComponent($.request.parameters.get("UserName"));
        } else {
            var content = $.request.body.asString();
            var postData = JSON.parse(content);
            UserName = postData.UserName;
        }
        var Organizer = XSDS.$importEntity("com.sap.sapmentors.sitreg.data", "SITreg.Organizer", {}, { $schemaName: "SITREG" });
        var existingOrganizer = Organizer.$get({ UserName: UserName });
        existingOrganizer.Status = 'A';
        existingOrganizer.History.ChangedBy = $.session.getUsername();
        existingOrganizer.History.ChangedAt = new Date();
        existingOrganizer.$save();
        XSDS.Transaction.$commit();        

        conn = $.hdb.getConnection();
        var grantOrganizerRoleToUser = conn.loadProcedure("SITREG", "com.sap.sapmentors.sitreg.odataorganizer.procedures::GrantOrganizerRoleToUser");
        var grantOrganizerRoleToUserResult = grantOrganizerRoleToUser(UserName);
        body = JSON.stringify(grantOrganizerRoleToUserResult);
    } catch (e) {
        $.response.contentType = "text/json";
        body = '{ "error": "' + e.toString() + '"}';
        $.response.status = $.net.http.BAD_REQUEST;
    }
    if (conn) {
        conn.close();
    }
    $.response.setBody( body );
}

confirmOrganizer();
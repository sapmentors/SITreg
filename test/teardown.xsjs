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

function Teardown() {
    var body;
    var conn;
    var pStmt;
    $.response.status = $.net.http.OK;
    $.response.contentType = "application/json";
    try {
        conn = $.db.getConnection("com.sap.sapmentors.sitreg.test::public");
        // Drop Users
        pStmt = conn.prepareCall('CALL "com.sap.sapmentors.sitreg.test.procedures::teardown"()');
        pStmt.execute();
        
        // conn.commit();

        var json = '{ "teardown" : true }';
        body = json;
    } catch (e) {
        body = "Error: exception caught: <br />" + e.toString();
        $.response.status = $.net.http.BAD_REQUEST;
    }
    if (conn) {
        conn.close();
    }
    $.response.setBody( body );
}
Teardown();
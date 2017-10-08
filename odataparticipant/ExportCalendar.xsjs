/*
   Copyright 2017 SAP Mentors
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

function addZ(n) {
    return (n<10)?'0'+n:''+n;
}

function dateToUTCString(date, time) {
    var oDate = date || new Date();
    var oTime = time || oDate;
    return oDate.getUTCFullYear() + 
           addZ(oDate.getUTCMonth() + 1) + 
           addZ(oDate.getUTCDate()) +
           'T' + 
           addZ(oTime.getUTCHours()) + 
           addZ(oTime.getUTCMinutes()) + 
           addZ(oTime.getUTCSeconds()) +
           'Z';
}
  
function isGETRequest() {
	try {
		return $.request.method === $.net.http.GET;
	} catch (e) {
		return null;
	}
}

function getEventId() {
	try {
		var sEventId = parseInt($.request.parameters.get("id"), 10);
		return sEventId || null;
	} catch (e) {
		return null;
	}
}

function exportToCalendar() {
    var sBody;
    
	if (!isGETRequest() || !getEventId()) {
	    sBody = "Error: Please pass Event ID";
	    $.response.status = $.net.http.BAD_REQUEST;
	    $.response.setBody(sBody);
        return;
	}
	
	try {
	var iEventId = getEventId();
	var sQuery = 'SELECT "ID", "Location", "EventDate", "StartTime", "EndTime", "Description", "HomepageURL"'
	            + ' FROM "com.sap.sapmentors.sitreg.data::SITreg.Event"'
	            + ' WHERE "ID" = ?';
	            
	var oConn = $.db.getConnection();              
	var pStmt = oConn.prepareStatement(sQuery);
	pStmt.setInteger(1, iEventId); 
	var oRs = pStmt.executeQuery();
	
	while (oRs.next()) {
	   var sLocation = oRs.getString(2);
	   var sEventDate = dateToUTCString(oRs.getDate(3));
	   var sStartTime = dateToUTCString(oRs.getDate(3), oRs.getTimestamp(4));
	   var sEndtTime = dateToUTCString(oRs.getDate(3), oRs.getTimestamp(5));
	   var sDescription = oRs.getString(6);
	   var sURL = oRs.getString(7);
	}
	
	sBody = 'BEGIN:VCALENDAR\n'
            + 'VERSION:2.0\n'
            + 'PRODID:-//hacksw/handcal//NONSGML v1.0//EN\n'
            + 'BEGIN:VEVENT\n'
            //+ 'UID:uid1@example.com\n' 
            + 'DTSTAMP:'+ sEventDate + '\n'
            //+ 'ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com\n'
            + 'DTSTART:'+ sStartTime + '\n'
            + 'DTEND:'+ sEndtTime + '\n'
            + 'LOCATION:'+ sLocation + '\n'
            + 'SUMMARY:'+ sDescription + '\n'
            + 'URL:' + sURL + '\n'
            + 'END:VEVENT\n'
            + 'END:VCALENDAR\n';
                
	$.response.contentType = "text/calendar; charset=utf-8";
	$.response.headers.set("Content-Disposition","attachment; filename=EventCalendar.ics");
	$.response.status = $.net.http.OK;
	
	}catch(e){
	    sBody = "Error: exception caught: <br />" + e.toString();
        $.response.status = $.net.http.BAD_REQUEST;
	}
	
	if(oConn){
	  oConn.close();  
	}
	
	$.response.setBody(sBody);
}

exportToCalendar();
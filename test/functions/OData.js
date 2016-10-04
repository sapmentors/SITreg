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

function prepareRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    xhr.setRequestHeader("X-CSRF-Token", csrfToken);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    return xhr;
}

function createEvent(Location, EventDate, StartTime, EndTime) {
    var create = {
        "ID": eventID,
        "Location": Location,
        "EventDate": EventDate,
        "StartTime": StartTime,
        "EndTime": EndTime,
        "MaxParticipants": 80,
        "HomepageURL": null
    };
    var xhr = prepareRequest("POST", "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events");
    xhr.send(JSON.stringify(create));
    return xhr;
}

function createVerySmallEvent(Location, EventDate, StartTime, EndTime) {
    var create = {
        "ID": eventIDsmall,
        "Location": Location,
        "EventDate": EventDate,
        "StartTime": StartTime,
        "EndTime": EndTime,
        "MaxParticipants": 1,
        "HomepageURL": null
    };
    var xhr = prepareRequest("POST", "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events");
    xhr.send(JSON.stringify(create));
    return xhr;
}

function registerAsOrganizer(UserName) {
    var register = {
        "UserName"           : UserName,
        "FirstName"			 : "Hello",
        "LastName"			 : "InsideTrack Munic",
        "EMail"			 	 : "hello@sitmuc.de",
        "MobilePhone"		 : "0123456789",
        "Status"             : "P", 
	    "RequestTimeStamp"   : "/Date(1475942400000)/",
	    "StatusSetTimeStamp" : "/Date(1475942400000)/",
	    "History.CreatedBy"  : UserName,
	    "History.CreatedAt"  : "/Date(1475942400000)/",
	    "History.ChangedBy"  : UserName,
	    "History.ChangedAt"  : "/Date(1475942400000)/"
    };
    var xhr = prepareRequest("POST", "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/RegisterAsOrganizer");
    xhr.send(JSON.stringify(register));
    return xhr;
}

function addCoOrganizer(_EventID, _UserName) {
    var create = {
        "EventID": _EventID,
        "UserName": _UserName,
        "Active": "Y"
    };
    var xhr = prepareRequest("POST", "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/CoOrganizers");
    xhr.send(JSON.stringify(create));
    return xhr;
}

function createParticipant(_EventID, _UserName, _ParticipantID = 1) {
    var participantUri =  "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Participant";
    var xhr = prepareRequest("POST", participantUri);
    var register = {
		ID: _ParticipantID,
		EventID: _EventID,
		FirstName: _UserName,
		LastName: _UserName + "LastName",
		EMail: _UserName + "@test.com",
		RSVP: "Y",
		"History.CreatedBy" : _UserName + "CreatedBy"
    };
    xhr.send(JSON.stringify(register));
    return xhr;
}

function readParticipant(_EventID, _UserName) {
    var participantUri =  "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/ParticipantRead";
    var xhr = prepareRequest("POST", participantUri);
    var register = {
		ID: 1,
		EventID: _EventID,
		FirstName: _UserName,
		LastName: _UserName + "LastName",
		EMail: _UserName + "@test.com",
		RSVP: "Y",
		"History.CreatedBy" : _UserName + "CreatedBy"
    };
    xhr.send(JSON.stringify(register));
    return xhr;
}

function getParticipantEventDetailsUrl(_EventID) {
    var eventDetailsUrl = "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Events(" + _EventID + ")";
    return eventDetailsUrl;
}

function getParticipantDetailsForEvent(_EventID) {
    var participantUrl = getParticipantEventDetailsUrl(_EventID) + "/Participant";
    var xhr = prepareRequest("GET", participantUrl);
    xhr.send();
    return xhr;
}

function getAllParticipantsDetailsForEvent(_EventID) {
    var participantUrl = getParticipantEventDetailsUrl(_EventID) + "/Participants";
    var xhr = prepareRequest("GET", participantUrl);
    xhr.send();
    return xhr;
}

function getParticipantEventTicketDetails(_EventID, _ParticipantID) {
    var receptionistUrl = "/com/sap/sapmentors/sitreg/odatareceptionist/service.xsodata/"+
                         "Events(" + _EventID + ")/" +
                         "Participants(" + _ParticipantID + ")/Ticket";
    var xhr = prepareRequest("GET", receptionistUrl);
    xhr.send();
    return xhr;
}

function getRegistrationNumbersForEvent(_EventID) {
    var registrationNumbersUrl = getParticipantEventDetailsUrl(_EventID) + "/RegistrationNumbers";
    var xhr = prepareRequest("GET", registrationNumbersUrl);
    xhr.send();
    return xhr;
}

function getRelationToSAP() {
    var RelationToSAPUrl = "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/RelationToSAP";
    var xhr = prepareRequest("GET", RelationToSAPUrl);
    xhr.send();
    return xhr;
}

function updateEvent(url) {
    var xhr = prepareRequest("PATCH", url);
    var change = {
        "MaxParticipants": MaxParticipants
    };
    xhr.send(JSON.stringify(change));
    return xhr;
}

function updateParticipant(_EventID, _change) {
    var xhr = getParticipantDetailsForEvent(_EventID);
    var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
    var participantUrl = body.d.__metadata.uri;
    xhr = prepareRequest("PATCH", participantUrl);
    xhr.send(JSON.stringify(_change));
    return { "xhr": xhr, "participantUrl": participantUrl };
}

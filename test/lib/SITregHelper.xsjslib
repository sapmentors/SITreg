function updateEvent(_service, _MaxParticipants, _header, _cookies) {
    var change = {
        "MaxParticipants": _MaxParticipants
    };
    var response = jasmine.callHTTPService(_service, 
        $.net.http.PATCH, 
        JSON.stringify(change), 
        _header, 
        _cookies
    );
    return response;
}

function createParticipant(_EventID, _UserName, _ParticipantID, _header, _cookies) {
    var participantUri =  "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Participant";
    var register = {
		ID: _ParticipantID,
		EventID: _EventID,
		FirstName: _UserName,
		LastName: _UserName + "LastName",
		EMail: _UserName + "@test.com",
		RSVP: "Y",
		"History.CreatedBy" : _UserName + "CreatedBy"
    };
    var response = jasmine.callHTTPService(participantUri, 
        $.net.http.POST, 
        JSON.stringify(register), 
        _header, 
        _cookies
    );
    return response;
}

function registerAsOrganizer(_UserName, _header, _cookies) {
    var register = {
        "UserName"           : _UserName,
        "FirstName"			 : "Hello",
        "LastName"			 : "InsideTrack Munic",
        "EMail"			 	 : "hello@sitmuc.de",
        "MobilePhone"		 : "0123456789",
        "Status"             : "P", 
	    "RequestTimeStamp"   : "/Date(1475942400000)/",
	    "StatusSetTimeStamp" : "/Date(1475942400000)/",
	    "History.CreatedBy"  : _UserName,
	    "History.CreatedAt"  : "/Date(1475942400000)/",
	    "History.ChangedBy"  : _UserName,
	    "History.ChangedAt"  : "/Date(1475942400000)/"
    };
    var response = jasmine.callHTTPService(
        "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/RegisterAsOrganizer", 
        $.net.http.POST, 
        JSON.stringify(register), 
        _header, 
        _cookies
    );
    return response;
}

function setLocale(_locale, _header, _cookies) {
    var locale = {
        "locale": _locale
    };
    var response = jasmine.callHTTPService(
        "/sap/hana/xs/formLogin/locale.xscfunc", 
        $.net.http.POST, 
        JSON.stringify(locale), 
        _header, 
        _cookies
    );
    return response;
}

function getRelationToSAP(_header, _cookies) {
    var RelationToSAPUrl = "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/RelationToSAP";
    var response = jasmine.callHTTPService(
        RelationToSAPUrl, 
        $.net.http.GET, 
        undefined, 
        _header, 
        _cookies
    );
    return response;
}

function getUserProfile(_header, _cookies) {
    var getUserProfileUrl = "/sap/hana/xs/formLogin/profile/manageUserProfile.xsjs?action=getUserProfile";
    var response = jasmine.callHTTPService(
        getUserProfileUrl, 
        $.net.http.GET, 
        undefined, 
        _header, 
        _cookies
    );
    return response;
}

function getParticipantEventDetailsUrl(_EventID) {
    var eventDetailsUrl = "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Events(" + _EventID + ")";
    return eventDetailsUrl;
}

function getParticipantDetailsForEvent(_EventID, _header, _cookies) {
    var participantUrl = getParticipantEventDetailsUrl(_EventID) + "/Participant";
    // jasmine.log("participantUrl: " + participantUrl);
    var response = jasmine.callHTTPService(
        participantUrl, 
        $.net.http.GET, 
        undefined, 
        _header, 
        _cookies
    );
    return response;
}

function getCalendarFile(_EventID, _header, _cookies) {
    var service = "/com/sap/sapmentors/sitreg/odataparticipant/ExportCalendar.xsjs";
    service = [service, "?ID=", _EventID].join("");
    return jasmine.callHTTPService(
        service, 
        $.net.http.GET, 
        undefined, 
        _header, 
        _cookies
    );
    
}

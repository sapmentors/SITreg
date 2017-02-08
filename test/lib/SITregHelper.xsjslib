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
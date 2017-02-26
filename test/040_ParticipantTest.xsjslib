var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;

function createParticipant(_EventID, _UserName, _ParticipantID = 1) {
    var participantUri =  "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Participant";
    // var xhr = prepareRequest("POST", participantUri);
    var register = {
		ID: _ParticipantID,
		EventID: _EventID,
		FirstName: _UserName,
		LastName: _UserName + "LastName",
		EMail: _UserName + "@test.com",
		RSVP: "Y",
		"History.CreatedBy" : _UserName + "CreatedBy"
    };
    var response = jasmine.callHTTPService(participantUri, $.net.http.POST, JSON.stringify(register), header, loginResult.cookies);
    expect(response.status).toBe($.net.http.CREATED);
    return response;
}

function exportEventToCalendar(_EventID){
    var service = "/com/sap/sapmentors/sitreg/odataparticipant/ExportCalendar.xsjs"
    service = [service, "?ID=", _EventID].join("");
    var response = jasmine.callHTTPService(service, $.net.http.GET, undefined, header, loginResult.cookies);
    expect(response.status).toBe($.net.http.OK);
    var body = response.body ? response.body.asString() : "";
    expect(body).toMatch(/BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-\/\/hacksw\/handcal\/\/NONSGML v1.0\/\/EN\nBEGIN:VEVENT\nDTSTAMP:\d\d\d\d\d\d\d\d\w\d\d\d\d\d\d\w\nDTSTART:\d\d\d\d\d\d\d\d\w\d\d\d\d\d\d\w\nDTEND:\d\d\d\d\d\d\d\d\w\d\d\d\d\d\d\w\nLOCATION:\.*.*\nSUMMARY:\.*.*\nURL:\.*.*\nEND:VEVENT\nEND:VCALENDAR/);
}

describe("Participant", function() {

    it("should login Participant and get csrfToken", function() {
        loginResult = helper.getCSRFtokenAndLogin("PARTICIPANT", helper.newpwd);
        header = helper.prepareRequestHeader(loginResult.csrf);
    });
    
    it("should Register as Participant", function(){
        createParticipant("1" , "PARTICIPANT");
    });
    
    it("should Get iCal file as Participant", function(){
        exportEventToCalendar("1");
    });
});
var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var sitRegHelper = $.import("com.sap.sapmentors.sitreg.test.lib", "SITregHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;
var eventUri;
var eventID;

describe("Co-Organizer", function() {

    it("should login and get csrfToken", function() {
        loginResult = helper.getCSRFtokenAndLogin("COORGANIZER", helper.newpwd);
        header = helper.prepareRequestHeader(loginResult.csrf);
    });

    it("should read participant details of all events", function() {
        var participantUri = parameters.readEventsService + encodeURI("&$expand=Participants,Participants/Ticket");
        var response = jasmine.callHTTPService(participantUri, $.net.http.GET, undefined, header, loginResult.cookies);
        expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
		for (var i = 0; i < body.d.results.length; ++i) {
			eventUri = body.d.results[i].__metadata.uri;
			eventID = body.d.results[i].ID;
            if(i === 0) {
                expect(body.d.results[i].Participants.results.length).toBe(0);
            } 
            else if (i > 0) {
                for (var j = 0; j < body.d.results[i].Participants.results.length; ++j) {
                    expect(body.d.results[i].Participants.results[j].Ticket.TicketUsed).toBe("N");
                }
            }
		}
    });
    
    it("should set Co-Organizers participation to No and confirm the first on the waiting list", function() {
        var change = {
            "RSVP": "N"
        };
        var result = sitRegHelper.updateParticipant(eventID, change, header, loginResult.cookies);
        var response = jasmine.callHTTPService(result.participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
        expect(body.d.RSVP).toBe("N");
    });

    it("should logout", function() {
        helper.logout(loginResult.csrf, loginResult.cookies);
        helper.checkSession();
    });
});
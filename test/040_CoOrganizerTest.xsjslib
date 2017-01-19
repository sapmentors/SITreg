var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;

function updateEvent(_service, _MaxParticipants) {
    var change = {
        "MaxParticipants": _MaxParticipants
    };
    var response = jasmine.callHTTPService(_service, $.net.http.PATCH, JSON.stringify(change), header, loginResult.cookies);
    return response;
}

describe("Co-Organizer", function() {

    it("should login COORGANIZER and get csrfToken", function() {
        loginResult = helper.getCSRFtokenAndLogin("COORGANIZER", helper.newpwd);
        header = helper.prepareRequestHeader(loginResult.csrf);
    });

    it("should update the MaxParticipants and check the change", function() {
        var newMaxParticipants = 85;
        var response = jasmine.callHTTPService(parameters.readEventsService, $.net.http.GET, undefined, header, loginResult.cookies);
        expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
		for (var i = 0; i < body.d.results.length; ++i) {
		    var eventUri = body.d.results[i].__metadata.uri;
		    response = updateEvent(eventUri, newMaxParticipants);
		    if(i === 0) {
		        expect(response.status).toBe(204);
                response = jasmine.callHTTPService(eventUri, $.net.http.GET, undefined, header, loginResult.cookies);
                var checkbody = helper.getResponseBody(response);
                expect(checkbody.d.MaxParticipants).toBe(newMaxParticipants);
		    } else if (i === 1) {
		        // For this event we're not the Co-Organizer
		        expect(response.status).toBe(400);
		    }
		}
    });

    it("should logout COORGANIZER", function() {
        helper.logout(loginResult.csrf, loginResult.cookies);
        helper.checkSession();
    });
});
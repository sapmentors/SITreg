var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var sitRegHelper = $.import("com.sap.sapmentors.sitreg.test.lib", "SITregHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;

describe("Participant", function() {

    it("should login PARTICIPANT and get csrfToken", function() {
        loginResult = helper.getCSRFtokenAndLogin("PARTICIPANT", helper.newpwd);
        header = helper.prepareRequestHeader(loginResult.csrf);
    });

    it("should try to update the MaxParticipants and register for all events", function() {
        var newMaxParticipants = 85;
        var response = jasmine.callHTTPService(parameters.readEventsServiceParticipant, $.net.http.GET, undefined, header, loginResult.cookies);
        expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
		for (var i = 0; i < body.d.results.length; ++i) {
		    var eventUri = body.d.results[i].__metadata.uri;
		    response = sitRegHelper.updateEvent(
		        eventUri, 
		        newMaxParticipants,
		        header, 
                loginResult.cookies
            );
            // jasmine.log(response.body.asString());
		    expect(response.status).toBe(403);
		    // Register for all events
	        response = sitRegHelper.createParticipant(
	            body.d.results[i].ID, 
	            "Participant Yeah", 
	            3,
		        header, 
                loginResult.cookies
            );
	        expect(response.status).toBe($.net.http.CREATED);
		}
    });

    it("should logout PARTICIPANT", function() {
        helper.logout(loginResult.csrf, loginResult.cookies);
        helper.checkSession();
    });
});
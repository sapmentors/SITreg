var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var sitRegHelper = $.import("com.sap.sapmentors.sitreg.test.lib", "SITregHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;

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
		    response = sitRegHelper.updateEvent(
		        eventUri, 
		        newMaxParticipants,
		        header, 
                loginResult.cookies
            );
		    if(i === 0) {
		        expect(response.status).toBe(204);
                response = jasmine.callHTTPService(eventUri, $.net.http.GET, undefined, header, loginResult.cookies);
                var checkbody = helper.getResponseBody(response);
                expect(checkbody.d.MaxParticipants).toBe(newMaxParticipants);
		    } else if (i === 1) {
		        // For this event we're not the Co-Organizer
		        expect(response.status).toBe(400);
		    } else if (body.d.results[i].MaxParticipants < 10) {
		        response = sitRegHelper.createParticipant(
		            body.d.results[i].ID, 
		            "Co Organizer Yeah", 
		            3,
    		        header, 
                    loginResult.cookies
                );
		        expect(response.status).toBe($.net.http.CREATED);
		    }
		}
    });

    it("should logout COORGANIZER", function() {
        helper.logout(loginResult.csrf, loginResult.cookies);
        helper.checkSession();
    });
});
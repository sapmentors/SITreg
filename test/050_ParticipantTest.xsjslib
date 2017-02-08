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

    it("should register as an Organizer", function() {
        var response = sitRegHelper.registerAsOrganizer(
            "PARTICIPANT",
            header, 
            loginResult.cookies
        );
        expect(response.status).toBe($.net.http.CREATED);
    });
    
    it("should return a list of possible relationships with different locales", function() {
        var tests = [
            { "locale": "en", "description": "Customer" },
            { "locale": "de", "description": "Kunde" }
            ];
        for (var i = 0; i < tests.length; ++i) {
            // jasmine.log("Set Locale to: " + tests[i].locale);
            var response = sitRegHelper.setLocale(
                tests[i].locale,
                header, 
                loginResult.cookies
            );
            expect(response.status).toBe($.net.http.OK);
            // For the current session the locale is set using the cookie xsSessionLanguage
            // so we have to add this cookie to the existing cookies
            /*
            jasmine.log("Response Cookies: " + JSON.stringify(helper.tupelListToObject(response.cookies)));
            jasmine.log("Login Cookies: " + JSON.stringify(loginResult.cookies));
            */
            loginResult.cookies.xsSessionLanguage = helper.tupelListToObject(response.cookies).xsSessionLanguage;
            // Check that locale was correctly set
            response = sitRegHelper.getUserProfile(
                header, 
                loginResult.cookies
            );
            expect(response.status).toBe($.net.http.OK);
            // jasmine.log(response.body.asString());
            var body = helper.getResponseBody(response);
            for (var j = 0; j < body.length; ++j) {
                if (body[j].PARAMETER === "LOCALE") {
                    // jasmine.log("Locale is: " + body[j].VALUE);
                    expect(body[j].VALUE).toBe(tests[i].locale);
                }
            }
            // Read relation to SAP
            response = sitRegHelper.getRelationToSAP(header, loginResult.cookies);
            expect(response.status).toBe($.net.http.OK);
            body = helper.getResponseBody(response);
            // jasmine.log("Description: " + tests[i].description);
            // jasmine.log(response.body.asString());
            expect(body.d.results.length).toBe(7);
            expect(body.d.results[0].Description).toBe(tests[i].description);
        }
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
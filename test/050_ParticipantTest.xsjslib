var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var sitRegHelper = $.import("com.sap.sapmentors.sitreg.test.lib", "SITregHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;
var eventUri;
var eventID;
var username = "PARTICIPANT";
var participantUrl;

describe("Participant", function() {

	it("should login PARTICIPANT and get csrfToken", function() {
		loginResult = helper.getCSRFtokenAndLogin(username, helper.newpwd);
		header = helper.prepareRequestHeader(loginResult.csrf);
	});

	it("should register as an Organizer", function() {
		var response = sitRegHelper.registerAsOrganizer(
			username,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe($.net.http.CREATED);
	});

	it("should return a list of possible relationships with different locales", function() {
		var tests = [
			{
				"locale": "en",
				"description": "Customer"
			},
			{
				"locale": "de",
				"description": "Kunde"
			}
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
		var response = jasmine.callHTTPService(
			parameters.readEventsServiceParticipant,
			$.net.http.GET,
			undefined,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
		for (var i = 0; i < body.d.results.length; ++i) {
			eventUri = body.d.results[i].__metadata.uri;
			eventID = body.d.results[i].ID;
			response = sitRegHelper.updateEvent(
				eventUri,
				newMaxParticipants,
				header,
				loginResult.cookies
			);
			// jasmine.log(response.body.asString());
			expect(response.status).toBe(403);
			// Register for all events
			// jasmine.log("Register for Event with ID: " + eventID);
			response = sitRegHelper.createParticipant(
				eventID,
				username,
				3,
				header,
				loginResult.cookies
			);
			expect(response.status).toBe($.net.http.CREATED);
		}
	});

	it("should try to read organizer OData service as participant", function() {
		var eventUriOrganizer = eventUri.replace("odataparticipant", "odataorganizer");

		var response = jasmine.callHTTPService(
			eventUriOrganizer,
			$.net.http.GET,
			undefined,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(403);
	});

	it("should read event details and update pre-eventing event status", function() {
		var response = sitRegHelper.getParticipantDetailsForEvent(
			eventID,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(200);
		var body = helper.getResponseBody(response);
		expect(body.d.FirstName).toBe(username);
		participantUrl = body.d.__metadata.uri;
		var change = {
			"PreEveningEvent": "Y",
			"Twitter": username
		};
		response = jasmine.callHTTPService(
			participantUrl,
			$.net.http.PATCH,
			JSON.stringify(change),
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(204);
		response = sitRegHelper.getParticipantDetailsForEvent(
			eventID,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(200);
		body = helper.getResponseBody(response);
		expect(body.d.PreEveningEvent).toBe("Y");
	});

	it("should remove Twitter handle", function() {
		var change = {
			"Twitter": ""
		};
		var response = jasmine.callHTTPService(
			participantUrl,
			$.net.http.PATCH,
			JSON.stringify(change),
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(204);
		response = sitRegHelper.getParticipantDetailsForEvent(
			eventID,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(200);
		var body = helper.getResponseBody(response);
		expect(body.d.Twitter).toBe("");
	});

	it("should read Small-Event and check for waiting status", function() {
        // jasmine.log("Read participant details for EventID: " + eventID);
		var response = sitRegHelper.getParticipantDetailsForEvent(
			eventID,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(200);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("W");
		/*
        participantIDmanual = body.d.ID;
        */
	});

	it("should get iCalendar file as Participant", function() {
		var response = sitRegHelper.getCalendarFile(
			eventID,
			header,
			loginResult.cookies
		);

		expect(response.status).toBe($.net.http.OK);

		var body = response.body ? response.body.asString() : "";
		//iCal regex
		expect(body).toMatch(
			/BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-\/\/hacksw\/handcal\/\/NONSGML v1.0\/\/EN\nBEGIN:VEVENT\nDTSTAMP:\d\d\d\d\d\d\d\d\w\d\d\d\d\d\d\w\nDTSTART:\d\d\d\d\d\d\d\d\w\d\d\d\d\d\d\w\nDTEND:\d\d\d\d\d\d\d\d\w\d\d\d\d\d\d\w\nLOCATION:\.*.*\nSUMMARY:\.*.*\nURL:\.*.*\nEND:VEVENT\nEND:VCALENDAR/
		);
	});

	it("should logout PARTICIPANT", function() {
		helper.logout(loginResult.csrf, loginResult.cookies);
		helper.checkSession();
	});
});
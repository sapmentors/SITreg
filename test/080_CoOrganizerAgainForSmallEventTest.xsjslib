var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var sitRegHelper = $.import("com.sap.sapmentors.sitreg.test.lib", "SITregHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;
var eventUri;
var eventID;
var participantUrl;
var registrationTime;

describe("Co-Organizer", function() {

	it("should login COORGANIZER and get csrfToken", function() {
		loginResult = helper.getCSRFtokenAndLogin("COORGANIZER", helper.newpwd);
		header = helper.prepareRequestHeader(loginResult.csrf);
	});

	it("should return no free seat", function() {
		var participantUri = parameters.readEventsService + encodeURI("&$expand=Participants,Participants/Ticket,RegistrationNumbers");
		var response = jasmine.callHTTPService(participantUri, $.net.http.GET, undefined, header, loginResult.cookies);
		expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
		var smallEventIndex = body.d.results.length - 1;
		eventUri = body.d.results[smallEventIndex].__metadata.uri;
		eventID = body.d.results[smallEventIndex].ID;
		expect(body.d.results[smallEventIndex].RegistrationNumbers.Free).toBe(0);
	});

	it("should change the registration status to waiting list", function() {
		var change = {
			"RSVP": "Y"
		};
		var result = sitRegHelper.updateParticipant(eventID, change, header, loginResult.cookies);
		participantUrl = result.participantUrl;
		var response = jasmine.callHTTPService(participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("W");
	});
	
	it("should update number of participants and confirm co-organizer on waiting list", function() {
		var response = sitRegHelper.updateEvent(
			eventUri, 
			2,
			header, 
			loginResult.cookies
		);
		expect(response.status).toBe(204);
		response = jasmine.callHTTPService(participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("Y");
	});

	it("should confirm co-organizer as he registered before the participant", function() {
		var response = sitRegHelper.updateEvent(
			eventUri, 
			1,
			header, 
			loginResult.cookies
		);
		expect(response.status).toBe(204);
		response = jasmine.callHTTPService(participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("Y");
	});

    it("should update on pre-eventing event status and not change RSVP", function() {
		var change = {
			"PreEveningEvent": "M"
		};
		var result = sitRegHelper.updateParticipant(eventID, change, header, loginResult.cookies);
		expect(result.response.status).toBe(204);
		
		var response = jasmine.callHTTPService(participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("Y");
        registrationTime = body.d.RegistrationTime;
	});

    it("change registration to no should change registration time to current time", function() {
		var change = {
			"RSVP": "N"
		};
		var result = sitRegHelper.updateParticipant(eventID, change, header, loginResult.cookies);
		expect(result.response.status).toBe(204);

		var response = jasmine.callHTTPService(participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("N");
        expect(body.d.RegistrationTime).not.toBe(registrationTime);
	});

    it("should change COORGANIZER back to registered and result in waiting list as registration time was reset", function() {
		var change = {
			"RSVP": "Y"
		};
		var result = sitRegHelper.updateParticipant(eventID, change, header, loginResult.cookies);
		expect(result.response.status).toBe(204);

		var response = jasmine.callHTTPService(participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("W");
	});

	it("should update number of participants to 2 and confirm co-organizer again", function() {
		var response = sitRegHelper.updateEvent(
			eventUri, 
			2,
			header, 
			loginResult.cookies
		);
		expect(response.status).toBe(204);
		response = jasmine.callHTTPService(participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("Y");
	});
	
	it("should update number of participants to 1 and put CoOrganizer on waiting list", function() {
		var response = sitRegHelper.updateEvent(
			eventUri, 
			1,
			header, 
			loginResult.cookies
		);
		expect(response.status).toBe(204);
		response = jasmine.callHTTPService(participantUrl, $.net.http.GET, undefined, header, loginResult.cookies);
		var body = helper.getResponseBody(response);
		expect(body.d.RSVP).toBe("W");
	});
	
	it("should logout COORGANIZER", function() {
		helper.logout(loginResult.csrf, loginResult.cookies);
		helper.checkSession();
	});
});
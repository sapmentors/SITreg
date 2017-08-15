var helper = $.import("com.sap.sapmentors.sitreg.test.lib", "TestHelper");
var sitRegHelper = $.import("com.sap.sapmentors.sitreg.test.lib", "SITregHelper");
var parameters = $.import("com.sap.sapmentors.sitreg.test", "parameters");

var loginResult;
var header;
var username = "PARTICIPANT";
var SHA256HASH;
var participantID;
var eventID;
var TicketCodeURL = "/com/sap/sapmentors/sitreg/odatareceptionist/checkTicket.xsjs";
var ReceptionistODataURL = "/com/sap/sapmentors/sitreg/odatareceptionist/service.xsodata";
var participantIDmanual;

describe("Participant", function() {

	it("should login PARTICIPANT and get csrfToken", function() {
		loginResult = helper.getCSRFtokenAndLogin(username, helper.newpwd);
		header = helper.prepareRequestHeader(loginResult.csrf);
	});

	it("should read the event ID", function() {
		var response = jasmine.callHTTPService(
                parameters.readEventsServiceParticipant, 
                $.net.http.GET,
                undefined,
                header,
                loginResult.cookies
            );
		expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
		var smallEventIndex = body.d.results.length - 1;
		// eventUri = body.d.results[smallEventIndex].__metadata.uri;
		eventID = body.d.results[smallEventIndex].ID;
	});

	it("should read ticket for event and return the hashed ticket code", function() {
		var response = jasmine.callHTTPService(
			sitRegHelper.getParticipantEventDetailsUrl(eventID) + "/Ticket",
			$.net.http.GET,
			undefined,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(200);
		var body = helper.getResponseBody(response);
		expect(body.d.EventID).toBe(eventID);
		expect(body.d.SHA256HASH).not.toBe(undefined);
        SHA256HASH = body.d.SHA256HASH;
        participantID = body.d.ParticipantID;
	});

	it("should read participant ID for manual ticket", function() {
		var response = jasmine.callHTTPService(
			"/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Ticket",
			$.net.http.GET,
			undefined,
			header,
			loginResult.cookies
		);
		expect(response.status).toBe(200);
		var body = helper.getResponseBody(response);
		// jasmine.log(response.body.asString());
		for (var j = 0; j < body.d.results.length; ++j) {
		    // jasmine.log(j + " EventID: " + body.d.results[j].EventID + ", ParticipantID: " + body.d.results[j].ParticipantID);
		    if(body.d.results[j].EventID !== eventID) {
		        participantIDmanual = body.d.results[j].ParticipantID;
		    }
		}
	});

	it("should logout PARTICIPANT", function() {
		helper.logout(loginResult.csrf, loginResult.cookies);
		helper.checkSession();
	});
});

describe("Receptionist", function() {
    it("should login RECEPTIONIST and get csrfToken", function() {
        loginResult = helper.getCSRFtokenAndLogin("RECEPTIONIST", helper.newpwd);
        header = helper.prepareRequestHeader(loginResult.csrf);
    });

    it("should check provided ticket using and return the Event and Participant ID", function() {
        var check = {
            "SHA256HASH": SHA256HASH
        };
		var response = jasmine.callHTTPService(
            TicketCodeURL, 
            $.net.http.POST, 
            JSON.stringify(check), 
            header, 
            loginResult.cookies
        );
		expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
        expect(body.OUTC[0].EventID).not.toBe(null);
    });

    it("should check provided ticket and return the Event and Participant ID", function() {
        TicketCodeURL = TicketCodeURL + "?SHA256HASH=" + encodeURIComponent(SHA256HASH);
		var response = jasmine.callHTTPService(
            TicketCodeURL, 
            $.net.http.GET, 
            undefined, 
            header, 
            loginResult.cookies
        );
		expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
        expect(body.OUTC[0].EventID).not.toBe(null);
    });

    it("should check in participant ticket and check in the participant", function() {
        var url = ReceptionistODataURL + "/Ticket(" + participantID + ")";
        // jasmine.log("Service URL: " + url);
        var check = {
            "SHA256HASH": SHA256HASH
        };
		var response = jasmine.callHTTPService(
            url, 
            $.net.http.PATCH, 
            JSON.stringify(check), 
            header, 
            loginResult.cookies
        );        
        expect(response.status).toBe(204);
    });
    
    it("should check that provided ticket was used", function() {
        var check = {
            "SHA256HASH": SHA256HASH
        };
		var response = jasmine.callHTTPService(
            TicketCodeURL, 
            $.net.http.POST, 
            JSON.stringify(check), 
            header, 
            loginResult.cookies
        );
		expect(response.status).toBe($.net.http.OK);
		var body = helper.getResponseBody(response);
        expect(body.OUTC[0].TicketUsed).toBe('Y');
    });

    it("should check in the participant manually", function() {
        var url = ReceptionistODataURL + "/Ticket(" + participantIDmanual + ")";
        // jasmine.log("Service URL: " + url);
        var check = {
            "TicketUsed": "M"
        };
		var response = jasmine.callHTTPService(
            url,
            $.net.http.PATCH, 
            JSON.stringify(check), 
            header, 
            loginResult.cookies
        );        
        expect(response.status).toBe(204);
    });

    it("should logout RECEPTIONIST", function() {
        helper.logout(loginResult.csrf, loginResult.cookies);
        helper.checkSession();
    });
});
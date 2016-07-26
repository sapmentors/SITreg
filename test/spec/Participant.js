describe("Login PARTICIPANT", function() {
    it("should login PARTICIPANT and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("PARTICIPANT", password);
    });
});

describe("Register as Organizer", function() {
    it("should add UserName to RegisterAsOrganizerQueue Table", function() {
        var xhr = registerAsOrganizer("PARTICIPANT");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");

    });
});

describe("Register as Participant", function() {
    it("should add UserName as an Participant of an Event", function() {
        var participantUri =  "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Participant";
        var register = {
			ID: 1,
			EventID: eventID,
			FirstName: "John",
			LastName: "Doe",
			EMail: EMail,
			RSVP: "Y",
			"History.CreatedBy" : "John"
        };
        var xhr = prepareRequest("POST", participantUri);
        xhr.send(JSON.stringify(register));
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
        // Register also for the second event
        register.EventID = eventID2;
        xhr = prepareRequest("POST", participantUri);
        xhr.send(JSON.stringify(register));
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");        
    });
});

describe("Try to read organizer OData service as participant", function() {
    it("should not be possible", function() {
        var xhr = prepareRequest("GET", eventUri + "/Participant");
        xhr.send();
        expect(xhr.status).toBe(403);
    });
});

describe("Read event details and update pre-eventing event", function() {
    it("should provide participation details and update pre-evining event status", function() {
        var participantUrl = "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Events(" + eventID + ")/Participant";
        var xhr = prepareRequest("GET", participantUrl);
        xhr.send();
        expect(xhr.status).toBe(200);
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.FirstName).toBe("John");
        participantUrl = body.d.__metadata.uri;
        xhr = prepareRequest("PATCH", participantUrl);
        var change = {
            "PreEveningEvent": "Y"
        };
        xhr.send(JSON.stringify(change));
        expect(xhr.status).toBe(204);
        xhr = prepareRequest("GET", participantUrl);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.PreEveningEvent).toBe("Y");
    });
});

describe("Logout PARTICIPANT", function() {
    it("should logout PARTICIPANT", function() {
        logout(csrfToken);
        checkSession();
    });
});
describe("Login ORGANIZER", function() {
    it("should login ORGANIZER and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("ORGANIZER", password);
    });
});

describe("Create event", function() {
    it("should create event", function() {
        var xhr = createEvent("München");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
        xhr = createEvent("Bern");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Read event and change MaxParticipants", function() {
    it("should return the created event, change the MaxParticipants and check the change", function() {
        var xhr = prepareRequest("GET", "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events");
        xhr.send();
        expect(xhr.status).toBe(200);
        expect(xhr.statusText).toBe("OK");
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results[0].Location).toBe("München");
        // Change MaxParticipants
        eventUri = body.d.results[0].__metadata.uri;
        eventUri2 = body.d.results[1].__metadata.uri;
        eventID2 = body.d.results[1].ID;
        xhr = xhr = updateEvent(eventUri);
        expect(xhr.status).toBe(204);
        // Check MaxParticipants
        xhr = prepareRequest("GET", eventUri);
        xhr.send();
        body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.MaxParticipants).toBe(MaxParticipants);
        eventID = body.d.ID;
    });
});

describe("Add COORGANIZER to event", function() {
    it("should add COORGANIZER to event", function() {
        var xhr = addCoOrganizer(eventID, "COORGANIZER");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

xdescribe("Add XSA_DEV to event", function() {
    it("should add XSA_DEV to event", function() {
        var xhr = addCoOrganizer(eventID, "XSA_DEV");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Read COORGANIZER's of event", function() {
    it("should read list of COORGANIZER's of an event", function() {
        var uri = eventUri + "/CoOrganizers";
        var xhr = prepareRequest("GET", uri);
        xhr.send();
        body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results[0].EventID).toBe(eventID);
        expect(body.d.results[0].UserName).toBe("COORGANIZER");
        expect(body.d.results[0].Active).toBe("Y");
    });
});

describe("Logout ORGANIZER", function() {
    it("should logout ORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});

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
        var register = {
			ID: 1,
			EventID: eventID,
			FirstName: "John",
			LastName: "Doe",
			EMail: "John.Doe@test.com",
			RSVP: "Y",
			"History.CreatedBy" : "John"
        };
        var xhr = prepareRequest("POST", "/com/sap/sapmentors/sitreg/odataparticipant/service.xsodata/Participant");
        xhr.send(JSON.stringify(register));
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Logout PARTICIPANT", function() {
    it("should logout PARTICIPANT", function() {
        logout(csrfToken);
        checkSession();
    });
});
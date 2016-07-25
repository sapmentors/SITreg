describe("Login COORGANIZER", function() {
    it("should login COORGANIZER and get csrfToken", function() {
        csrfToken = getCSRFtokenAndLogin("COORGANIZER", password);
    });
});

describe("Change Homepage URL and read event as COORGANIZER", function() {
    it("should update the Homepage URL and check the change", function() {
        var xhr = updateEvent(eventUri);
        expect(xhr.status).toBe(204);
        // Check MaxParticipants
        xhr = prepareRequest("GET", eventUri);
        xhr.send();
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.MaxParticipants).toBe(MaxParticipants);
    });
});

describe("Change data of an event where the COORGANIZER is not listed as a co-organizer", function() {
    it("should not be possible", function() {
        var xhr = xhr = updateEvent(eventUri2);
        expect(xhr.status).toBe(400);
    });
});

describe("Logout COORGANIZER", function() {
    it("should logout COORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
